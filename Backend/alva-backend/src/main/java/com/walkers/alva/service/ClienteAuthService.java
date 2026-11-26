package com.walkers.alva.service;

import com.walkers.alva.dto.request.ClienteSolicitarCodigoRequestDTO;
import com.walkers.alva.dto.request.ClienteVerificarCodigoRequestDTO;
import com.walkers.alva.dto.response.ClienteAuthResponseDTO;
import com.walkers.alva.exception.CodigoExpiradoException;
import com.walkers.alva.exception.CodigoInvalidoException;
import com.walkers.alva.exception.MuitasTentativasException;
import com.walkers.alva.model.Cliente;
import com.walkers.alva.model.CodigoAcesso;
import com.walkers.alva.repository.ClienteRepository;
import com.walkers.alva.repository.CodigoAcessoRepository;
import com.walkers.alva.service.otp.OtpSender;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

/**
 * RF01 — Autenticação passwordless do cliente, em dois passos:
 * 1) solicitarCodigo: gera um código numérico, guarda só o hash dele e o
 *    envia pelo canal configurado (WhatsApp/SMS/console — ver OtpSender).
 * 2) verificarCodigo: confirma o código e só então gera o acesso (JWT),
 *    criando o cadastro do cliente na primeira vez que ele entra.
 */
@Service
public class ClienteAuthService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final ClienteRepository clienteRepository;
    private final CodigoAcessoRepository codigoAcessoRepository;
    private final ClienteJwtService clienteJwtService;
    private final OtpSender otpSender;
    private final PasswordEncoder passwordEncoder;

    @Value("${alva.otp.expiracao-minutos}")
    private int expiracaoMinutos;

    @Value("${alva.otp.max-tentativas}")
    private int maxTentativas;

    public ClienteAuthService(
            ClienteRepository clienteRepository,
            CodigoAcessoRepository codigoAcessoRepository,
            ClienteJwtService clienteJwtService,
            OtpSender otpSender,
            PasswordEncoder passwordEncoder
    ) {
        this.clienteRepository = clienteRepository;
        this.codigoAcessoRepository = codigoAcessoRepository;
        this.clienteJwtService = clienteJwtService;
        this.otpSender = otpSender;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void solicitarCodigo(ClienteSolicitarCodigoRequestDTO dto) {
        String codigo = gerarCodigoNumerico();

        CodigoAcesso codigoAcesso = new CodigoAcesso();
        codigoAcesso.setNome(dto.nome());
        codigoAcesso.setWhatsapp(dto.whatsapp());
        codigoAcesso.setCodigoHash(passwordEncoder.encode(codigo));
        codigoAcesso.setCriadoEm(LocalDateTime.now());
        codigoAcesso.setExpiraEm(LocalDateTime.now().plusMinutes(expiracaoMinutos));
        codigoAcessoRepository.save(codigoAcesso);

        // Envio só acontece depois que o código já está salvo, para nunca
        // informar um código que não possa ser verificado em seguida.
        otpSender.enviar(dto.whatsapp(), codigo);
    }

    @Transactional
    public ClienteAuthResponseDTO verificarCodigo(ClienteVerificarCodigoRequestDTO dto) {
        CodigoAcesso codigoAcesso = codigoAcessoRepository
                .findFirstByWhatsappAndUsadoFalseOrderByCriadoEmDesc(dto.whatsapp())
                .orElseThrow(CodigoInvalidoException::new);

        if (codigoAcesso.getExpiraEm().isBefore(LocalDateTime.now())) {
            throw new CodigoExpiradoException();
        }

        if (codigoAcesso.getTentativas() >= maxTentativas) {
            throw new MuitasTentativasException();
        }

        if (!passwordEncoder.matches(dto.codigo(), codigoAcesso.getCodigoHash())) {
            codigoAcesso.setTentativas(codigoAcesso.getTentativas() + 1);
            codigoAcessoRepository.save(codigoAcesso);
            throw new CodigoInvalidoException();
        }

        codigoAcesso.setUsado(true);
        codigoAcessoRepository.save(codigoAcesso);

        Cliente cliente = clienteRepository.findByWhatsapp(dto.whatsapp())
                .orElseGet(() -> {
                    Cliente novo = new Cliente();
                    novo.setWhatsapp(dto.whatsapp());
                    return novo;
                });
        cliente.setNome(codigoAcesso.getNome());
        Cliente salvo = clienteRepository.save(cliente);

        String token = clienteJwtService.gerarToken(salvo.getId(), salvo.getNome(), salvo.getWhatsapp());
        return new ClienteAuthResponseDTO(token, salvo.getId(), salvo.getNome());
    }

    private String gerarCodigoNumerico() {
        int numero = RANDOM.nextInt(1_000_000);
        return String.format("%06d", numero);
    }
}

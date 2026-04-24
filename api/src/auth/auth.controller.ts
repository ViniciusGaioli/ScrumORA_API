import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login';
import { Public } from 'src/common/decorators/public.decorator';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService, 
  ) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('test-email')
  async testEmail(@Body() body: { email: string }) {
    await this.mailService.enviarEmail({
      para: body.email,
      assunto: 'Teste ScrumORA',
      html: '<h1>Funcionou!</h1><p>Este é um email de teste do ScrumORA.</p>',
      texto: 'Funcionou! Este é um email de teste do ScrumORA.',
    });
    return { ok: true };
  }
}
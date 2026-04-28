import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EmailVerificationService } from 'src/auth/email-verification.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existente = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existente) throw new ConflictException('E-mail já cadastrado');

    const senhaHash = await bcrypt.hash(dto.senha, 10);
    const user = this.userRepo.create({ ...dto, senha: senhaHash });
    const userSalvo = await this.userRepo.save(user);

    this.emailVerificationService.sendVerificationEmail(userSalvo)
      .catch((err) => {
        console.error('Falha ao enviar email de verificação:', err);
      });

    return userSalvo;
  }

  findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id }});
    if (!user) throw new NotFoundException(`Usuário ${id} não encontrado`);
    return user;
  }

  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepo.createQueryBuilder('user').addSelect('user.senha').where('user.email = :email', {email}).getOne();
  }

  async findByGoogle(googleId: string, email: string): Promise<User | null> {
    return (
      await this.userRepo.findOne({ where: { googleId } }) ??
      await this.userRepo.findOne({ where: { email } }) ??
      null
    );
  }

  async findOrCreateByGoogle(profile: { googleId: string; email: string; nome: string; fotoPerfil?: string }): Promise<User> {
    let user = await this.userRepo.findOne({ where: { googleId: profile.googleId } });
    if (user) return user;

    user = await this.userRepo.findOne({ where: { email: profile.email } });
    if (user) {
      user.googleId = profile.googleId;
      return this.userRepo.save(user);
    }

    const novo = this.userRepo.create({
      googleId: profile.googleId,
      email: profile.email,
      nome: profile.nome,
      fotoPerfil: profile.fotoPerfil,
      emailVerificado: true,
    });
    return this.userRepo.save(novo);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (updateUserDto.senha) updateUserDto.senha = await bcrypt.hash(updateUserDto.senha, 10);
    Object.assign(user, updateUserDto);
    return this.userRepo.save(user);
  }

  async remove(id: number) {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Usuário ${id} não encontrado`);
  }
}

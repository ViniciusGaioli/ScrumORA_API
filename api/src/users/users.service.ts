import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(CreateUserDto: CreateUserDto): Promise<User> {
    const existente = await this.userRepo.findOne({ where: {email: CreateUserDto.email}})
    if (existente) throw new ConflictException('E-mail já cadastrado');
    const senhaHash = await bcrypt.hash(CreateUserDto.senha, 10);
    const user = this.userRepo.create({...CreateUserDto, senha: senhaHash});
    return this.userRepo.save(user);
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

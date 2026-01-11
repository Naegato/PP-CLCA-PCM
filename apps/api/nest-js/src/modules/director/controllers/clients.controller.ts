import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  HttpCode, Inject,
} from '@nestjs/common';

// Use cases
import { DirectorGetAllClients } from '@pp-clca-pcm/application';
import { DirectorGetClientAccounts } from '@pp-clca-pcm/application';
import { DirectorManageCreate } from '@pp-clca-pcm/application';
import { DirectorManageUpdate } from '@pp-clca-pcm/application';
import { DirectorManageDelete } from '@pp-clca-pcm/application';
import { DirectorManageBan } from '@pp-clca-pcm/application';
import { REPOSITORY_TOKENS } from 'src/config/repositories.module';

// DTOs
import { CreateClientDto } from '../dto/clients/create-client.dto';
import { UpdateClientDto } from '../dto/clients/update-client.dto';
import { BanClientDto } from '../dto/clients/ban-client.dto';

// Guards, Decorators, Interceptors
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ErrorInterceptor } from '../../../common/interceptors/error.interceptor';

// Repositories
import type { Security, UserRepository, BanRepository } from '@pp-clca-pcm/application';
import { Email, User } from '@pp-clca-pcm/domain';

/**
 * DirectorClientsController
 *
 * Gère la gestion des clients par les directors:
 * - Récupérer tous les clients
 * - Récupérer les comptes d'un client
 * - Créer un client
 * - Modifier un client
 * - Supprimer un client
 * - Bannir un client
 */
@Controller('director/clients')
@UseGuards(AuthGuard, RolesGuard)
@Roles('director')
@UseInterceptors(ErrorInterceptor)
export class DirectorClientsController {
  constructor(
    // private readonly getAllClients: DirectorGetAllClients,
    // private readonly getClientAccount: DirectorGetClientAccount,
    // private readonly createClient: DirectorManageCreate,
    // private readonly updateClient: DirectorManageUpdate,
    // private readonly deleteClient: DirectorManageDelete,
    // private readonly banClient: DirectorManageBan,
    // private readonly userRepository: UserRepository,
    @Inject('Security')
    private readonly security: Security,
    @Inject(REPOSITORY_TOKENS.USER)
    private readonly userRepository: UserRepository,
    @Inject(REPOSITORY_TOKENS.BAN)
    private readonly banRepository: BanRepository,
  ) {}

  /**
   * GET /director/clients
   * Récupérer tous les clients
   */
  @Get()
  async getAll() {
    const useCase = new DirectorGetAllClients(this.userRepository);
    return await useCase.execute();
  }

  /**
   * GET /director/clients/:id/accounts
   * Récupérer les comptes d'un client
   */
  @Get(':id/accounts')
  async getAccounts(@Param('id') userId: string) {
    const user = await this.userRepository.findById(userId);
    if (user instanceof Error) {
      return user;
    }

    const useCase = new DirectorGetClientAccounts(this.userRepository);

    return await useCase.execute(user);
  }

  /**
   * POST /director/clients
   * Créer un nouveau client
   */
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateClientDto) {
    const useCase = new DirectorManageCreate(this.userRepository, this.security);
    return await useCase.execute(
      dto.firstname,
      dto.lastname,
      dto.email,
      dto.password,
    );
  }

  /**
   * PATCH /director/clients/:id
   * Modifier un client
   */
  @Patch(':id')
  async update(@Param('id') userId: string, @Body() dto: UpdateClientDto) {
    const useCase = new DirectorManageUpdate(this.userRepository, this.security);

    const email = dto.email ? Email.create(dto.email) : undefined;

    if (email instanceof Error) {
      throw email;
    }

    return await useCase.execute(
      userId,
      {
        firstname: dto.firstname,
        lastname: dto.lastname,
        email: email,
      },
    );
  }

  /**
   * DELETE /director/clients/:id
   * Supprimer un client
   */
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') userId: string) {
    const useCase = new DirectorManageDelete(this.userRepository, this.security);
    return await useCase.execute(userId);
  }

  /**
   * POST /director/clients/:id/ban
   * Bannir un client
   */
  @Post(':id/ban')
  @HttpCode(200)
  async ban(@Param('id') userId: string, @Body() dto: BanClientDto) {
    const endDate = dto.endDate ? new Date(dto.endDate) : undefined;

    const useCase = new DirectorManageBan(this.userRepository, this.banRepository, this.security);
    return await useCase.execute(userId, dto.reason, endDate);
  }
}

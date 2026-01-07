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
  HttpCode,
} from '@nestjs/common';

// Use cases
import { DirectorGetAllClients } from '@pp-clca-pcm/application';
import { DirectorGetClientAccount } from '@pp-clca-pcm/application';
import { DirectorManageCreate } from '@pp-clca-pcm/application';
import { DirectorManageUpdate } from '@pp-clca-pcm/application';
import { DirectorManageDelete } from '@pp-clca-pcm/application';
import { DirectorManageBan } from '@pp-clca-pcm/application';

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
import type { UserRepository } from '@pp-clca-pcm/application';
import { User } from '@pp-clca-pcm/domain';

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
    private readonly getAllClients: DirectorGetAllClients,
    private readonly getClientAccount: DirectorGetClientAccount,
    private readonly createClient: DirectorManageCreate,
    private readonly updateClient: DirectorManageUpdate,
    private readonly deleteClient: DirectorManageDelete,
    private readonly banClient: DirectorManageBan,
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * GET /director/clients
   * Récupérer tous les clients
   */
  @Get()
  async getAll() {
    return await this.getAllClients.execute();
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

    return await this.getClientAccount.execute(user);
  }

  /**
   * POST /director/clients
   * Créer un nouveau client
   */
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateClientDto) {
    return await this.createClient.execute(
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
    return await this.updateClient.execute(
      userId,
      // TODO: ADD PROPS FROM CLIENT ...
      dto as Parameters<typeof User.prototype.update>[0],
    );
  }

  /**
   * DELETE /director/clients/:id
   * Supprimer un client
   */
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') userId: string) {
    return await this.deleteClient.execute(userId);
  }

  /**
   * POST /director/clients/:id/ban
   * Bannir un client
   */
  @Post(':id/ban')
  @HttpCode(200)
  async ban(@Param('id') userId: string, @Body() dto: BanClientDto) {
    const endDate = dto.endDate ? new Date(dto.endDate) : undefined;
    return await this.banClient.execute(userId, dto.reason, endDate);
  }
}

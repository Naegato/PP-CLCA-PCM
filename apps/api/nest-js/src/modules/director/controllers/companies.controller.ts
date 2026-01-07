import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, UseInterceptors, HttpCode, Inject } from '@nestjs/common';

// Use cases
import { DirectorCreateCompany } from '@pp-clca-pcm/application';
import { DirectorDeleteCompany } from '@pp-clca-pcm/application';
import { DirectorGetAllCompanies } from '@pp-clca-pcm/application';
import { DirectorGetCompany } from '@pp-clca-pcm/application';
import { DirectorUpdateCompany } from '@pp-clca-pcm/application';

// DTOs
import { CreateCompanyDto } from '../dto/companies/create-company.dto';
import { UpdateCompanyDto } from '../dto/companies/update-company.dto';

// Guards, Decorators, Interceptors
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ErrorInterceptor } from '../../../common/interceptors/error.interceptor';

// Repositories & Services
import type { CompanyRepository, StockRepository } from '@pp-clca-pcm/application';
import { REPOSITORY_TOKENS } from '../../../config/repositories.module';

/**
 * DirectorCompaniesController
 *
 * Gère la gestion des entreprises par les directors:
 * - Récupérer toutes les entreprises
 * - Récupérer une entreprise
 * - Créer une entreprise
 * - Modifier une entreprise
 * - Supprimer une entreprise
 */
@Controller('director/companies')
@UseGuards(AuthGuard, RolesGuard)
@Roles('director')
@UseInterceptors(ErrorInterceptor)
export class DirectorCompaniesController {
  constructor(
    @Inject(REPOSITORY_TOKENS.COMPANY)
    private readonly companyRepository: CompanyRepository,
    @Inject(REPOSITORY_TOKENS.STOCK)
    private readonly stockRepository: StockRepository,
  ) {}

  /**
   * GET /director/companies
   * Récupérer toutes les entreprises
   */
  @Get()
  async getAll() {
    const useCase = new DirectorGetAllCompanies(this.companyRepository);
    return await useCase.execute();
  }

  /**
   * GET /director/companies/:id
   * Récupérer une entreprise
   */
  @Get(':id')
  async get(@Param('id') id: string) {
    const useCase = new DirectorGetCompany(this.companyRepository);
    return await useCase.execute(id);
  }

  /**
   * POST /director/companies
   * Créer une entreprise
   */
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateCompanyDto) {
    const useCase = new DirectorCreateCompany(this.companyRepository);
    return await useCase.execute(dto.name);
  }

  /**
   * PATCH /director/companies/:id
   * Modifier une entreprise
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCompanyDto) {
    const useCase = new DirectorUpdateCompany(this.companyRepository);
    return await useCase.execute(id, dto.name);
  }

  /**
   * DELETE /director/companies/:id
   * Supprimer une entreprise
   */
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    const useCase = new DirectorDeleteCompany(this.companyRepository, this.stockRepository);
    return await useCase.execute(id);
  }
}

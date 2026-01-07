import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * Mapping des erreurs métier vers les codes HTTP
 *
 * Ce mapping permet de convertir automatiquement les erreurs Error-as-Value
 * retournées par les use cases en exceptions HTTP appropriées.
 */
const ERROR_STATUS_MAP: Record<string, HttpStatus> = {
  // Authentication errors
  LoginInvalidCredentialsError: HttpStatus.UNAUTHORIZED,
  InvalidResetTokenError: HttpStatus.BAD_REQUEST,
  TokenSecretNotDefinedError: HttpStatus.INTERNAL_SERVER_ERROR,

  // User errors
  EmailAlreadyExistError: HttpStatus.CONFLICT,
  UserNotFoundByEmailError: HttpStatus.NOT_FOUND,
  UserNotFoundByIdError: HttpStatus.NOT_FOUND,
  UserUpdateError: HttpStatus.BAD_REQUEST,

  // Account errors
  AccountCreateError: HttpStatus.BAD_REQUEST,
  AccountDeleteError: HttpStatus.BAD_REQUEST,
  AccountUpdateError: HttpStatus.BAD_REQUEST,
  InvalidIbanError: HttpStatus.BAD_REQUEST,
  ClientGetAccountError: HttpStatus.NOT_FOUND,
  ClientGetBalanceAccountError: HttpStatus.NOT_FOUND,

  // Loan errors
  SimulatedLoanError: HttpStatus.BAD_REQUEST,

  // Stock errors
  ClientGetStockWithPriceError: HttpStatus.NOT_FOUND,
  ClientCancelStockOrderError: HttpStatus.BAD_REQUEST,
  ClientGetStockOrdersError: HttpStatus.NOT_FOUND,
  ClientRegisterStockOrderError: HttpStatus.BAD_REQUEST,
  MatchStockOrderError: HttpStatus.BAD_REQUEST,

  // Portfolio errors
  ClientCreatePortfolioError: HttpStatus.BAD_REQUEST,
  ClientGetPortfolioError: HttpStatus.NOT_FOUND,

  // Director errors
  DirectorCreateCompanyError: HttpStatus.BAD_REQUEST,
  DirectorDeleteCompanyError: HttpStatus.BAD_REQUEST,
  DirectorGetCompanyError: HttpStatus.NOT_FOUND,
  DirectorUpdateCompanyError: HttpStatus.BAD_REQUEST,
  DirectorCreateStockError: HttpStatus.BAD_REQUEST,
  DirectorDeleteStockError: HttpStatus.BAD_REQUEST,
  DirectorToggleStockListingError: HttpStatus.BAD_REQUEST,
  DirectorUpdateStockError: HttpStatus.BAD_REQUEST,

  // Authorization errors
  NotAdvisor: HttpStatus.FORBIDDEN,
  NotClient: HttpStatus.FORBIDDEN,
  NotDirector: HttpStatus.FORBIDDEN,

  // Resource not found
  DiscussionNotFoundError: HttpStatus.NOT_FOUND,

  // Account type errors
  AccountTypeAlreadyExistError: HttpStatus.CONFLICT,
  AccountTypeDoesNotExistError: HttpStatus.NOT_FOUND,

  // Transaction errors
  TransactionError: HttpStatus.BAD_REQUEST,

  // Engine errors
  GenerateDailyInterestError: HttpStatus.INTERNAL_SERVER_ERROR,

  // Default
  DEFAULT: HttpStatus.BAD_REQUEST,
};

/**
 * ErrorInterceptor
 *
 * Intercepteur global qui convertit les erreurs Error-as-Value retournées
 * par les use cases en exceptions HTTP avec le status code approprié.
 *
 * Ce pattern permet aux use cases de rester framework-agnostic tout en
 * fournissant des réponses HTTP correctes aux clients.
 *
 * Usage:
 * ```typescript
 * @Controller('users')
 * @UseInterceptors(ErrorInterceptor)
 * export class UsersController {
 *   @Get(':id')
 *   async getUser(@Param('id') id: string) {
 *     // Si le use case retourne une erreur, l'interceptor la convertit en HttpException
 *     return await this.getUserUseCase.execute(id);
 *   }
 * }
 * ```
 */
@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Si le résultat est une instance d'Error, convertir en HttpException
        if (data instanceof Error) {
          const errorName = data.constructor.name;
          const statusCode = ERROR_STATUS_MAP[errorName] || ERROR_STATUS_MAP.DEFAULT;

          throw new HttpException(
            {
              statusCode,
              message: data.message,
              error: errorName,
            },
            statusCode,
          );
        }

        // Si le résultat n'est pas une erreur, le retourner tel quel
        return data;
      }),
      catchError((err) => {
        // Si c'est déjà une HttpException, la laisser passer
        if (err instanceof HttpException) {
          return throwError(() => err);
        }

        // Erreur inattendue
        console.error('[ErrorInterceptor] Unexpected error:', err);
        return throwError(
          () =>
            new HttpException(
              {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
                error: 'InternalServerError',
              },
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
        );
      }),
    );
  }
}

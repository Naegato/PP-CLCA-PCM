.PHONY: up up-nextjs up-nestjs up-express db clear install build prisma-generate prisma-migrate prisma-reset up-db tests api-test help

help:
	@echo "Available targets:"
	@echo "  make install         - Install all dependencies with pnpm"
	@echo "  make build           - Build all packages (domain, application, adapters)"
	@echo "  make db              - Start Docker containers (PostgreSQL, MariaDB, Redis)"
	@echo "  make prisma-generate - Generate Prisma client"
	@echo "  make prisma-migrate  - Run Prisma migrations"
	@echo "  make prisma-reset    - Reset Prisma databases (drops all data)"
	@echo "  make up-db           - Start DB + generate + migrate"
	@echo "  make tests           - Run tests (requires up-db)"
	@echo "  make api-test        - Run API E2E tests (requires up-db)"
	@echo "  make up              - Start all apps (requires tests to pass)"
	@echo "  make up-nestjs       - Start NestJS API only"
	@echo "  make up-nextjs       - Start Next.js frontend only"
	@echo "  make up-express      - Start Express API only"
	@echo "  make clear           - Remove all node_modules"

.env:
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo ".env created from .env.example"; \
	else \
		echo ".env already exists"; \
	fi

install:
	pnpm install

build: install prisma-generate
	pnpm build

db: .env
	docker compose up -d
	@echo "Waiting for databases to be ready..."
	@sleep 3

prisma-generate: install
	pnpm prisma:generate

prisma-reset: db
	pnpm prisma:reset

prisma-migrate: db
	pnpm prisma:migrate

up-db: db prisma-generate prisma-migrate

tests: up-db build
	pnpm test

api-test: up-db build
	cd apps/api/nest-js && pnpm test:e2e

up: tests
	@echo "Starting all applications..."
	@pnpm dev:api & pnpm dev:front & pnpm dev:express & wait

up-nestjs: up-db build
	pnpm dev:nest

up-nextjs:
	pnpm dev:front

up-express: up-db build
	pnpm dev:express

clear:
	rm -rf node_modules
	rm -rf src/node_modules
	rm -rf src/domain/node_modules
	rm -rf src/domain/dist
	rm -rf src/application/node_modules
	rm -rf src/application/dist
	rm -rf src/infrastructure/adapters/node_modules
	rm -rf src/infrastructure/adapters/dist
	rm -rf src/infrastructure/tests/node_modules
	rm -rf apps/api/nest-js/node_modules
	rm -rf apps/api/nest-js/dist
	rm -rf apps/front/next-js/node_modules
	rm -rf apps/front/next-js/.next
	@echo "All node_modules removed"

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { IDealResponse, LoginDto, RegisterDto, Role } from 'contracts';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { firstUserStub } from './stubs';

const firstUser = firstUserStub();

describe('APP E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cookie = '';

  beforeAll(async () => {
    process.env['DATABASE_URL'] =
      'postgresql://satoshi@localhost:5432/nest_investor_testing';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get(PrismaService);

    const configService = app.get(ConfigService);
    app.use(
      session({
        secret: configService.getOrThrow('SESSION_SECRET'),
        resave: false,
        saveUninitialized: false,
      }),
    );

    app.use(cookieParser());

    app.useGlobalPipes(new ValidationPipe());

    await prisma.cleandDb();
    await app.init();
  });

  afterAll(() => {
    app.close();
  });

  describe('AppModule', () => {
    it('should be defined', () => {
      expect(app).toBeDefined();
    });
  });

  describe('Auth', () => {
    describe('register', () => {
      it('should register', () => {
        const dto: RegisterDto = firstUser.registerDto;

        return request(app.getHttpServer())
          .post('/auth/register')
          .send(dto)
          .expect(201);
      });
    });

    describe('login', () => {
      it('should login', async () => {
        const dto: LoginDto = firstUser.loginDto;

        return request(app.getHttpServer())
          .post('/auth/login')
          .send(dto)
          .expect(200)
          .expect('Set-Cookie', /connect.sid/)
          .expect(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                name: firstUser.registerDto.name,
                email: firstUser.registerDto.email,
                role: Role.INVESTOR,
              }),
            );
            expect(body.id).toBeGreaterThan(0);
          })
          .expect(({ headers }) => {
            cookie = headers?.['set-cookie'];
          });
      });
    });
  });

  describe('Portfolio', () => {
    describe('POST /portfolio', () => {
      it('should create 1st portfolio', () => {
        return request(app.getHttpServer())
          .post('/portfolio')
          .set('Cookie', cookie)
          .send(firstUser.portfolios[0].createDto)
          .expect(201)
          .expect(({ body }) => {
            firstUser.portfolios[0].id = parseInt(body.id);
            expect(body).toEqual(
              expect.objectContaining({
                name: firstUser.portfolios[0].createDto.name,
                compound: firstUser.portfolios[0].createDto.compound,
              }),
            );
            expect(body.id).toBeGreaterThan(0);
          });
      });

      it('should create 2nd portfolio', () => {
        return request(app.getHttpServer())
          .post('/portfolio')
          .set('Cookie', cookie)
          .send(firstUser.portfolios[1].createDto)
          .expect(201)
          .expect(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                name: firstUser.portfolios[1].createDto.name,
                compound: firstUser.portfolios[1].createDto.compound,
              }),
            );
            expect(body.id).toBeGreaterThan(0);
          });
      });
    });

    describe('PATCH /portfolio', () => {
      it('should update portfolio', () => {
        return request(app.getHttpServer())
          .patch(`/portfolio/${firstUser.portfolios[0].id}`)
          .set('Cookie', cookie)
          .send(firstUser.portfolios[0].updateDto)
          .expect(200)
          .expect(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                name: firstUser.portfolios[0].updateDto.name,
              }),
            );
            expect(body.id).toBeGreaterThan(0);
          });
      });
    });

    describe('GET /portfolio', () => {
      it('should get 2 portfolios', () => {
        return request(app.getHttpServer())
          .get('/portfolio')
          .set('Cookie', cookie)
          .expect(200)
          .expect(({ body }) => {
            expect(body.length).toEqual(2);
            expect(body[0].name).toEqual(
              firstUser.portfolios[1].createDto.name,
            );
          });
      });
    });

    describe('GET /portfolio/:id', () => {
      it('get portfolio by id', () => {
        return request(app.getHttpServer())
          .get(`/portfolio/${firstUser.portfolios[0].id}`)
          .set('Cookie', cookie)
          .expect(200)
          .expect(({ body }) => {
            expect(body).toMatchObject({
              name: firstUser.portfolios[0].updateDto.name,
              compound: firstUser.portfolios[0].createDto.compound,
            });
          });
      });

      it.todo('get portfolio of another user by id - must fail');
    });
  });

  describe('Cashout', () => {
    it('should create 1st cashout', () => {
      return request(app.getHttpServer())
        .post('/cashout')
        .set('Cookie', cookie)
        .send({
          ...firstUser.portfolios[0].cashouts[0].createDto,
          portfolioId: firstUser.portfolios[0].id,
        })
        .expect(201)
        .expect(({ body }) => {
          expect(body).toMatchObject({
            amount: firstUser.portfolios[0].cashouts[0].createDto.amount,
            date: firstUser.portfolios[0].cashouts[0].createDto.date.toISOString(),
          });
          expect(body.id).toBeGreaterThan(0);
          firstUser.portfolios[0].cashouts[0].id = body.id;
        });
    });
  });

  describe('Deal', () => {
    it('should create 1st deal for 1st portfolio', () => {
      return request(app.getHttpServer())
        .post('/deal')
        .set('Cookie', cookie)
        .send({
          ...firstUser.portfolios[0].deals[0].createDto,
          portfolioId: firstUser.portfolios[0].id,
        })
        .expect(201)
        .expect(({ body }) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { securityType, ...dto } =
            firstUser.portfolios[0].deals[0].createDto;
          const expectedResponse: Omit<
            IDealResponse,
            'id' | 'securityId' | 'date'
          > & {
            date: string;
          } = {
            ...dto,
            date: dto.date.toISOString(),
            portfolioId: firstUser.portfolios[0].id,
          };

          expect(body).toMatchObject(expectedResponse);
          expect(body.id).toBeGreaterThan(0);
          expect(body.securityId).toBeGreaterThan(0);
          firstUser.portfolios[0].deals[0].id = body.id;
        });
    });
  });

  describe('Deposit', () => {
    it('should create 1st deposit', () => {
      return request(app.getHttpServer())
        .post('/deposit')
        .set('Cookie', cookie)
        .send({
          ...firstUser.portfolios[0].deposits[0].createDto,
          portfolioId: firstUser.portfolios[0].id,
        })
        .expect(201)
        .expect(({ body }) => {
          expect(body.amount).toEqual(
            firstUser.portfolios[0].deposits[0].createDto.amount,
          );
          expect(body.date).toEqual(
            firstUser.portfolios[0].deposits[0].createDto.date.toISOString(),
          );
          expect(body.id).toBeGreaterThan(0);
          firstUser.portfolios[0].deposits[0].id = body.id;
        });
    });
  });

  describe('Check Portfolio', () => {
    it.todo('should get portfolio with all results and relations');
  });

  describe('Deleting everything', () => {
    describe('DELETE /cashout', () => {
      it('should delete cashout by id', async () => {
        await request(app.getHttpServer())
          .delete(`/cashout/${firstUser.portfolios[0].cashouts[0].id}`)
          .set('Cookie', cookie)
          .expect(204);
      });
      it.todo('delete cashout of another user - must fail');
    });

    describe('DELETE /deposit', () => {
      it('should delete deposit by id', async () => {
        await request(app.getHttpServer())
          .delete(`/deposit/${firstUser.portfolios[0].deposits[0].id}`)
          .set('Cookie', cookie)
          .expect(204);
      });

      it.todo('delete deposit of another user - must fail');
    });

    describe('DELETE /deal', () => {
      it('should delete deal by id', async () => {
        await request(app.getHttpServer())
          .delete(`/deal/${firstUser.portfolios[0].deals[0].id}`)
          .set('Cookie', cookie)
          .expect(204);
      });

      it.todo('delete deal of another user - must fail');
    });

    describe('DELETE /portfolio/:id', () => {
      it('should delete portfolio by id', async () => {
        await request(app.getHttpServer())
          .delete(`/portfolio/${firstUser.portfolios[0].id}`)
          .set('Cookie', cookie)
          .expect(204);

        return request(app.getHttpServer())
          .get(`/portfolio/${firstUser.portfolios[0].id}`)
          .set('Cookie', cookie)
          .expect(404);
      });

      it.todo('delete portfolio of another user by id - must fail');
    });
  });
});

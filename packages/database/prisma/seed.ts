import { MoexBoard, MoexEngine, MoexMarket } from "contracts";
import { PrismaClient } from "@prisma/client";
import { hash } from "argon2";
const prisma = new PrismaClient();

async function main(): Promise<void> {
  await createMeAdmin();

  await seedCurrencies();
}

async function createMeAdmin(): Promise<void> {
  const sasha = await prisma.user.findUnique({
    where: {
      email: "sashafem@mail.ru",
    },
  });

  // Если нет юзера админа то создаем его сидом
  if (!sasha) {
    const hashedPassword = await hash("12345");
    await prisma.user.create({
      data: {
        email: "sashafem@mail.ru",
        name: "Aleksandr Petrov",
        hashedPassword,
        role: "ADMIN",
      },
    });
  }
}

async function seedCurrencies(): Promise<void> {
  const arrOfCurrencies = [
    {
      board: MoexBoard.CETS,
      engine: MoexEngine.currency,
      market: MoexMarket.selt,
      name: "Доллар-рубль",
      shortName: "USDRUB_TOD",
      ticker: "USD000000TOD",
    },
  ];

  await prisma.$transaction(
    arrOfCurrencies.map((c) =>
      prisma.moexCurrency.upsert({
        where: { ticker: c.ticker },
        create: { ...c },
        update: { ...c },
      }),
    ),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

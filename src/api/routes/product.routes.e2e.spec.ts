import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import request from "supertest";
import { app } from "../app";
import { migrator } from "../../modules/@shared/infra/db/migrator";
import { ProductModel } from "../../modules/product-adm/repository/product.model";

describe("Product E2E test", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([ProductModel]);
    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    await migration.down();
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app).post("/products").send({
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe("Product 1");
    expect(response.body.description).toBe("Product 1 description");
    expect(response.body.purchasePrice).toBe(100);
    expect(response.body.stock).toBe(10);
    expect(response.body.salesPrice).toBe(100);
  });
});

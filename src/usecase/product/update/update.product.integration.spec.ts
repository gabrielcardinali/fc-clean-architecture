import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";

describe("Test update product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const product = new Product("1", "Old Name", 100);
    await productRepository.create(product);

    const input = {
      id: "1",
      name: "Updated Name",
      price: 200,
    };

    const result = await usecase.execute(input);

    expect(result).toEqual({
      id: "1",
      name: "Updated Name",
      price: 200,
    });

    const updatedProduct = await productRepository.find("1");
    expect(updatedProduct.name).toBe("Updated Name");
    expect(updatedProduct.price).toBe(200);
  });
});

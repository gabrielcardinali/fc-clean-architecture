import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import CreateCustomerUseCase from "./create.customer.usecase";

describe("Test create customer use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a customer", async () => {
    const customerRepository = new CustomerRepository();
    const usecase = new CreateCustomerUseCase(customerRepository);

    const input = {
      name: "John",
      address: {
        street: "Street",
        number: 123,
        zip: "Zip",
        city: "City",
      },
    };

    const result = await usecase.execute(input);

    expect(result).toMatchObject({
      id: expect.any(String),
      name: "John",
      address: {
        street: "Street",
        number: 123,
        zip: "Zip",
        city: "City",
      },
    });

    const customerInDb = await customerRepository.find(result.id);
    expect(customerInDb.name).toBe("John");
    expect(customerInDb.Address.street).toBe("Street");
  });
});

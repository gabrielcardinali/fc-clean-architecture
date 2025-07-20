import { Sequelize } from "sequelize-typescript";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import ListCustomerUseCase from "./list.customer.usecase";

describe("Test list customer use case", () => {
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

  it("should list all customers", async () => {
    const customerRepository = new CustomerRepository();
    const usecase = new ListCustomerUseCase(customerRepository);

    const customer1 = new Customer("1", "John");
    customer1.changeAddress(new Address("Street 1", 111, "Zip 1", "City 1"));

    const customer2 = new Customer("2", "Jane");
    customer2.changeAddress(new Address("Street 2", 222, "Zip 2", "City 2"));

    await customerRepository.create(customer1);
    await customerRepository.create(customer2);

    const result = await usecase.execute({});

    expect(result.customers).toHaveLength(2);
    expect(result.customers).toEqual(
      expect.arrayContaining([
        {
          id: "1",
          name: "John",
          address: {
            street: "Street 1",
            number: 111,
            zip: "Zip 1",
            city: "City 1",
          },
        },
        {
          id: "2",
          name: "Jane",
          address: {
            street: "Street 2",
            number: 222,
            zip: "Zip 2",
            city: "City 2",
          },
        },
      ])
    );
  });
});

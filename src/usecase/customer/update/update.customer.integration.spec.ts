import { Sequelize } from "sequelize-typescript";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import UpdateCustomerUseCase from "./update.customer.usecase";

describe("Test update customer use case", () => {
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

  it("should update a customer", async () => {
    const customerRepository = new CustomerRepository();
    const usecase = new UpdateCustomerUseCase(customerRepository);

    const customer = new Customer("1", "John");
    customer.changeAddress(new Address("Old Street", 1, "Old Zip", "Old City"));
    await customerRepository.create(customer);

    const input = {
      id: "1",
      name: "John Updated",
      address: {
        street: "New Street",
        number: 999,
        zip: "New Zip",
        city: "New City",
      },
    };

    const result = await usecase.execute(input);

    expect(result).toEqual({
      id: "1",
      name: "John Updated",
      address: {
        street: "New Street",
        number: 999,
        zip: "New Zip",
        city: "New City",
      },
    });

    const updatedCustomer = await customerRepository.find("1");
    expect(updatedCustomer.name).toBe("John Updated");
    expect(updatedCustomer.Address.street).toBe("New Street");
  });
});

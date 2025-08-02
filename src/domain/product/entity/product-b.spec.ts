import ProductB from "./product-b";

describe("ProductB unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      const productB = new ProductB("", "ProductB 1", 100);
    }).toThrowError("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      const productB = new ProductB("123", "", 100);
    }).toThrowError("Name is required");
  });

  it("should throw error when price is less than zero", () => {
    expect(() => {
      const productB = new ProductB("123", "Name", -1);
    }).toThrowError("Price must be greater than zero");
  });

  it("should change name", () => {
    const productB = new ProductB("123", "ProductB 1", 100);
    productB.changeName("ProductB 2");
    expect(productB.name).toBe("ProductB 2");
  });

  it("should change price", () => {
    const productB = new ProductB("123", "ProductB 1", 100);
    productB.changePrice(150);
    expect(productB.price).toBe(300);
  });
});

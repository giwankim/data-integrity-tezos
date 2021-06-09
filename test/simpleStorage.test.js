const SimpleStorage = artifacts.require("SimpleStorage");

contract("SimpleStorage", () => {
  let simpleStorageInstance;
  let storage;

  before(async() => {
    simpleStorageInstance = await SimpleStorage.deployed();
    storage = await simpleStorageInstance.storage();
    assert.equal(storage, 3, "Storage was not set to 3")
  });

  it("...should store the integer 3.", async () => {
    // const simpleStorageInstance = await SimpleStorage.deployed();
    // await simpleStorageInstance.default(89);
    const storedInt = await simpleStorageInstance.storage();
    assert.equal(storedInt, 3, "The integer 3 was not stored.");
  });
});

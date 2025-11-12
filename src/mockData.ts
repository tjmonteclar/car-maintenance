export const mockUsers = [
  {
    id: "1",
    email: "admin@example.com",
    password: "password",
    name: "Admin User"
  },
  {
    id: "2", 
    name: "tj",
    email: "tj@example.com", 
    password: "123456"
  }
];

export const mockRecords = [
  {
    id: "1",
    driverName: "Tj",
    carPlate: "54212", 
    carModel: "Lexus",
    partsCount: 2,
    totalCost: 90,
    date: "2025-11-01",
    status: "Completed",
    parts: [
      {
        partType: "Battery",
        replaced: "No",
        cost: 50
      },
      {
        partType: "Air Filter", 
        replaced: "No",
        cost: 40
      }
    ]
  },
  {
    id: "2",
    driverName: "Tj",
    carPlate: "42233",
    carModel: "Toyota", 
    partsCount: 1,
    totalCost: 70,
    date: "2025-11-03",
    status: "Completed",
    parts: [
      {
        partType: "Air Filter",
        replaced: "Yes", 
        cost: 70
      }
    ]
  }
];
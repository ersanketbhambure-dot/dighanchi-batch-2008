export type BatchmateStatus = "Attending" | "Not Attending" | "Pending";

export type Batchmate = {
  name: string;
  status: BatchmateStatus;
};

export const batchmates: Batchmate[] = [
  { name: "Amit Patil", status: "Attending" },
  { name: "Priya Shinde", status: "Pending" },
  { name: "Rohit Jadhav", status: "Not Attending" },
  { name: "Snehal Pawar", status: "Attending" },
  { name: "Vikas More", status: "Pending" },
];

import { TaskCreateArgs, _TaskController } from "@/lib/models/task/task.class";
import { IRepository } from "@/lib/repository.class";
import { DateTime } from "luxon";

const MockRepository = {
  query: jest.fn(() => {
    return new Promise((resolve) =>
      // Resolve a dummy QueryResult
      resolve({
        command: "",
        rowCount: 0,
        oid: 0,
        fields: [],
        rows: [],
      })
    );
  }),
  close: jest.fn(),
};

describe("TaskController.createOne", () => {
  const validArgs: TaskCreateArgs[] = [
    {
      text: "Test",
    },

    {
      text: "Test with notes",
      notes: "Some notes",
    },
    {
      text: "Test with date",
      createdAt: DateTime.fromISO("1990-01-01T06:00:00+06:00"),
    },
    {
      text: "Test with all args",
      notes: "some notes",
      createdAt: DateTime.fromISO("1990-01-01T06:00:00+06:00"),
    },
  ];

  it.each(validArgs)("createOne(%s)", async (args: TaskCreateArgs) => {
    const TestController = new _TaskController(MockRepository as IRepository);
    await TestController.createOne(args);

    expect(MockRepository.query).toHaveBeenCalledWith(
      'INSERT INTO tasks("text", notes, createdAt) VALUES ($1, $2, $3)',
      [
        args.text,
        args.notes,
        /** The timestamp should be converted to UTC */
        args.createdAt ? "1990-01-01T00:00:00.000Z" : undefined,
      ]
    );
  });
});

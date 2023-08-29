import prisma from "../../lib/prisma";

const handler = async (req, res) => {
  const { method } = req;
  if (method == "POST") {
    try {
      const { body } = req;
      await prisma.report.upsert({
        where: {
          id: body.id,
        },
        create: body,
        update: body,
      });
      res.status(200).send("Report saved successfully!");
    } catch (e) {
      console.log(e);
      res.status(500).send("Error saving report!", e);
    }
  } else if (method == "GET") {
    const reports = await prisma.report.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(reports);
  } else {
    res.status(500).send("Method not allowed!");
  }
};

export default handler;

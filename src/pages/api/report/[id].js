import prisma from "../../../lib/prisma";

const handler = async (req, res) => {
  const { method } = req;
  const { id } = req.query;

  if (method == "GET") {
    const report = await prisma.report.findFirst({
      where: {
        id,
      },
    });
    res.status(200).json(report);
  } else {
    res.status(500).send("Method not allowed!");
  }
};

export default handler;

import { useEffect, useState } from "react";
import Loader from "./Loader";

export default function PastReports() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getReports = async () => {
    const response = await fetch("/api/report");
    const data = await response.json();
    setReports(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getReports();
  }, []);

  const columns = ["Name", "Created At", "Action"];

  if (isLoading) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {columns.map((column) => (
                <th scope="col" className="px-6 py-3">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.map((report: any) => (
              <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {report.name}
                </th>
                <td className="px-6 py-4">
                  {new Date(report.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    second: "2-digit",
                    // timeZone: "UTC",
                  })}
                </td>
                <td className="px-6 py-4">
                  <a
                    href={`/reports/${report.id}`}
                    className="font-medium text-blue-600 dark:text-blue-500 no-underline hover:underline"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

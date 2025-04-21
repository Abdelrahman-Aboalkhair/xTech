import * as csv from "csv-stringify/sync";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import {
  AnalyticsOverview,
  ProductPerformance,
  UserAnalytics,
} from "@/modules/analytics/analytics.types";

interface AllAnalytics {
  overview: AnalyticsOverview;
  products: ProductPerformance[];
  users: UserAnalytics;
}

type ExportableData =
  | AnalyticsOverview
  | ProductPerformance[]
  | UserAnalytics
  | AllAnalytics;

export class ExportUtils {
  private flattenObject(obj: any, prefix: string = ""): any {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        return { ...acc, ...this.flattenObject(obj[key], newKey) };
      } else if (Array.isArray(obj[key])) {
        acc[newKey] = JSON.stringify(obj[key]);
      } else {
        acc[newKey] = obj[key];
      }
      return acc;
    }, {} as any);
  }

  private formatAnalyticsData(data: ExportableData): any[] {
    if (Array.isArray(data)) {
      // ProductPerformance[]
      return data.map((item) => this.flattenObject(item));
    } else if ("overview" in data && "products" in data && "users" in data) {
      // AllAnalytics
      const { overview, products, users } = data as AllAnalytics;
      const overviewData = this.flattenObject({
        ...overview,
        changes: overview.changes,
        monthlyTrends: {
          labels: JSON.stringify(overview.monthlyTrends.labels),
          revenue: JSON.stringify(overview.monthlyTrends.revenue),
          orders: JSON.stringify(overview.monthlyTrends.orders),
          sales: JSON.stringify(overview.monthlyTrends.sales),
          users: JSON.stringify(overview.monthlyTrends.users),
        },
      });
      const productsData = products.map((item, index) => ({
        productRank: index + 1,
        ...this.flattenObject(item),
      }));
      const usersData = [
        this.flattenObject({
          ...users,
          changes: users.changes,
          interactionTrends: {
            labels: JSON.stringify(users.interactionTrends.labels),
            views: JSON.stringify(users.interactionTrends.views),
            clicks: JSON.stringify(users.interactionTrends.clicks),
            others: JSON.stringify(users.interactionTrends.others),
          },
        }),
        ...users.topUsers.map((user: any, index: number) => ({
          topUserRank: index + 1,
          ...this.flattenObject(user),
        })),
      ];
      return [overviewData, ...productsData, ...usersData];
    } else if ("totalUsers" in data && "topUsers" in data) {
      // UserAnalytics
      const { topUsers, interactionTrends, changes, ...rest } =
        data as UserAnalytics;
      const flattenedRest = this.flattenObject({
        ...rest,
        changes,
        interactionTrends: {
          labels: JSON.stringify(interactionTrends.labels),
          views: JSON.stringify(interactionTrends.views),
          clicks: JSON.stringify(interactionTrends.clicks),
          others: JSON.stringify(interactionTrends.others),
        },
      });
      return [
        flattenedRest,
        ...topUsers.map((user: any, index: number) => ({
          topUserRank: index + 1,
          ...this.flattenObject(user),
        })),
      ];
    } else {
      // AnalyticsOverview
      const { monthlyTrends, changes, ...rest } = data as AnalyticsOverview;
      const flattenedRest = this.flattenObject({
        ...rest,
        changes,
        monthlyTrends: {
          labels: JSON.stringify(monthlyTrends.labels),
          revenue: JSON.stringify(monthlyTrends.revenue),
          orders: JSON.stringify(monthlyTrends.orders),
          sales: JSON.stringify(monthlyTrends.sales),
          users: JSON.stringify(monthlyTrends.users),
        },
      });
      return [flattenedRest];
    }
  }

  generateCSV(data: ExportableData): string {
    const formattedData = this.formatAnalyticsData(data);
    return csv.stringify(formattedData, {
      header: true,
      quoted: true,
      quoted_empty: true,
    });
  }

  generatePDF(data: ExportableData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on("data", (chunk: Buffer) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err: Error) =>
        reject(new Error(`PDF generation failed: ${err.message}`))
      );

      try {
        doc
          .fontSize(16)
          .font("Helvetica-Bold")
          .text("Analytics Report", { align: "center" })
          .moveDown(1);

        if ("overview" in data && "products" in data && "users" in data) {
          // AllAnalytics
          const { overview, products, users } = data as AllAnalytics;

          // Overview Section
          doc
            .fontSize(12)
            .font("Helvetica")
            .text("Analytics Overview", { underline: true })
            .moveDown(0.5);
          doc
            .fontSize(10)
            .text(`Total Revenue: $${overview.totalRevenue.toFixed(2)}`)
            .text(`Total Orders: ${overview.totalOrders}`)
            .text(`Total Sales: ${overview.totalSales}`)
            .text(`Total Users: ${overview.totalUsers}`)
            .text(
              `Average Order Value: $${overview.averageOrderValue.toFixed(2)}`
            )
            .moveDown(0.5);
          doc.fontSize(12).text("Changes", { underline: true }).moveDown(0.5);
          doc
            .fontSize(10)
            .text(
              `Revenue Change: ${
                overview.changes.revenue
                  ? overview.changes.revenue.toFixed(2) + "%"
                  : "N/A"
              }`
            )
            .text(
              `Orders Change: ${
                overview.changes.orders
                  ? overview.changes.orders.toFixed(2) + "%"
                  : "N/A"
              }`
            )
            .text(
              `Sales Change: ${
                overview.changes.sales
                  ? overview.changes.sales.toFixed(2) + "%"
                  : "N/A"
              }`
            )
            .text(
              `Users Change: ${
                overview.changes.users
                  ? overview.changes.users.toFixed(2) + "%"
                  : "N/A"
              }`
            )
            .text(
              `AOV Change: ${
                overview.changes.averageOrderValue
                  ? Number(overview.changes.averageOrderValue).toFixed(2) + "%"
                  : "N/A"
              }`
            )
            .moveDown(0.5);
          doc
            .fontSize(12)
            .text("Monthly Trends", { underline: true })
            .moveDown(0.5);
          overview.monthlyTrends.labels.forEach(
            (label: string, index: number) => {
              doc
                .fontSize(10)
                .text(`${label}:`)
                .text(
                  `  Revenue: $${overview.monthlyTrends.revenue[index].toFixed(
                    2
                  )}`
                )
                .text(`  Orders: ${overview.monthlyTrends.orders[index]}`)
                .text(`  Sales: ${overview.monthlyTrends.sales[index]}`)
                .text(`  Users: ${overview.monthlyTrends.users[index]}`)
                .moveDown(0.5);
            }
          );

          // Products Section
          doc
            .fontSize(12)
            .text("Product Performance", { underline: true })
            .moveDown(0.5);
          products.forEach((item, index) => {
            doc
              .fontSize(10)
              .text(`Product ${index + 1}: ${item.name}`)
              .text(`ID: ${item.id}`)
              .text(`Quantity Sold: ${item.quantity}`)
              .text(`Revenue: $${item.revenue.toFixed(2)}`)
              .moveDown(0.5);
          });

          // Users Section
          doc
            .fontSize(12)
            .text("User Analytics", { underline: true })
            .moveDown(0.5);
          doc
            .fontSize(10)
            .text(`Total Users: ${users.totalUsers}`)
            .text(`Total Revenue: $${users.totalRevenue.toFixed(2)}`)
            .text(`Retention Rate: ${users.retentionRate.toFixed(2)}%`)
            .text(`Average Lifetime Value: $${users.lifetimeValue.toFixed(2)}`)
            .text(
              `Repeat Purchase Rate: ${users.repeatPurchaseRate.toFixed(2)}%`
            )
            .text(
              `Average Engagement Score: ${users.engagementScore.toFixed(2)}`
            )
            .text(
              `Users Change: ${
                users.changes?.users
                  ? users.changes.users.toFixed(2) + "%"
                  : "N/A"
              }`
            )
            .moveDown(1);
          doc.fontSize(12).text("Top Users", { underline: true }).moveDown(0.5);
          users.topUsers.forEach((user: any, index: number) => {
            doc
              .fontSize(10)
              .text(`User ${index + 1}: ${user.name}`)
              .text(`Email: ${user.email}`)
              .text(`Orders: ${user.orderCount}`)
              .text(`Total Spent: $${user.totalSpent.toFixed(2)}`)
              .text(`Engagement Score: ${user.engagementScore.toFixed(2)}`)
              .moveDown(0.5);
          });
          doc
            .fontSize(12)
            .text("Interaction Trends", { underline: true })
            .moveDown(0.5);
          users.interactionTrends.labels.forEach(
            (label: string, index: number) => {
              doc
                .fontSize(10)
                .text(`${label}:`)
                .text(`  Views: ${users.interactionTrends.views[index]}`)
                .text(`  Clicks: ${users.interactionTrends.clicks[index]}`)
                .text(`  Others: ${users.interactionTrends.others[index]}`)
                .moveDown(0.5);
            }
          );
        } else if (Array.isArray(data)) {
          // ProductPerformance
          doc
            .fontSize(12)
            .font("Helvetica")
            .text("Product Performance", { underline: true })
            .moveDown(0.5);
          data.forEach((item: ProductPerformance, index: number) => {
            doc
              .fontSize(10)
              .text(`Product ${index + 1}: ${item.name}`)
              .text(`ID: ${item.id}`)
              .text(`Quantity Sold: ${item.quantity}`)
              .text(`Revenue: $${item.revenue.toFixed(2)}`)
              .moveDown(0.5);
          });
        } else if ("totalUsers" in data && "topUsers" in data) {
          // UserAnalytics
          const {
            totalUsers,
            totalRevenue,
            retentionRate,
            lifetimeValue,
            repeatPurchaseRate,
            engagementScore,
            changes,
            topUsers,
            interactionTrends,
          } = data as UserAnalytics;
          doc
            .fontSize(12)
            .font("Helvetica")
            .text("User Analytics", { underline: true })
            .moveDown(0.5);
          doc
            .fontSize(10)
            .text(`Total Users: ${totalUsers}`)
            .text(`Total Revenue: $${totalRevenue.toFixed(2)}`)
            .text(`Retention Rate: ${retentionRate.toFixed(2)}%`)
            .text(`Average Lifetime Value: $${lifetimeValue.toFixed(2)}`)
            .text(`Repeat Purchase Rate: ${repeatPurchaseRate.toFixed(2)}%`)
            .text(`Average Engagement Score: ${engagementScore.toFixed(2)}`)
            .text(
              `Users Change: ${
                changes?.users ? changes.users.toFixed(2) + "%" : "N/A"
              }`
            )
            .moveDown(1);
          doc.fontSize(12).text("Top Users", { underline: true }).moveDown(0.5);
          topUsers.forEach((user: any, index: number) => {
            doc
              .fontSize(10)
              .text(`User ${index + 1}: ${user.name}`)
              .text(`Email: ${user.email}`)
              .text(`Orders: ${user.orderCount}`)
              .text(`Total Spent: $${user.totalSpent.toFixed(2)}`)
              .text(`Engagement Score: ${user.engagementScore.toFixed(2)}`)
              .moveDown(0.5);
          });
          doc
            .fontSize(12)
            .text("Interaction Trends", { underline: true })
            .moveDown(0.5);
          interactionTrends.labels.forEach((label: string, index: number) => {
            doc
              .fontSize(10)
              .text(`${label}:`)
              .text(`  Views: ${interactionTrends.views[index]}`)
              .text(`  Clicks: ${interactionTrends.clicks[index]}`)
              .text(`  Others: ${interactionTrends.others[index]}`)
              .moveDown(0.5);
          });
        } else if ("totalRevenue" in data && "monthlyTrends" in data) {
          // AnalyticsOverview
          const {
            totalRevenue,
            totalOrders,
            totalSales,
            totalUsers,
            averageOrderValue,
            changes,
            monthlyTrends,
          } = data as AnalyticsOverview;
          doc
            .fontSize(12)
            .font("Helvetica")
            .text("Analytics Overview", { underline: true })
            .moveDown(0.5);
          doc
            .fontSize(10)
            .text(`Total Revenue: $${totalRevenue.toFixed(2)}`)
            .text(`Total Orders: ${totalOrders}`)
            .text(`Total Sales: ${totalSales}`)
            .text(`Total Users: ${totalUsers}`)
            .text(`Average Order Value: $${averageOrderValue.toFixed(2)}`)
            .moveDown(0.5);
          doc.fontSize(12).text("Changes", { underline: true }).moveDown(0.5);
          doc
            .fontSize(10)
            .text(
              `Revenue Change: ${
                changes.revenue ? changes.revenue.toFixed(2) + "%" : "N/A"
              }`
            )
            .text(
              `Orders Change: ${
                changes.orders ? changes.orders.toFixed(2) + "%" : "N/A"
              }`
            )
            .text(
              `Sales Change: ${
                changes.sales ? changes.sales.toFixed(2) + "%" : "N/A"
              }`
            )
            .text(
              `Users Change: ${
                changes.users ? changes.users.toFixed(2) + "%" : "N/A"
              }`
            )
            .text(
              `AOV Change: ${
                changes.averageOrderValue
                  ? Number(changes.averageOrderValue).toFixed(2) + "%"
                  : "N/A"
              }`
            )
            .moveDown(0.5);
          doc
            .fontSize(12)
            .text("Monthly Trends", { underline: true })
            .moveDown(0.5);
          monthlyTrends.labels.forEach((label: string, index: number) => {
            doc
              .fontSize(10)
              .text(`${label}:`)
              .text(`  Revenue: $${monthlyTrends.revenue[index].toFixed(2)}`)
              .text(`  Orders: ${monthlyTrends.orders[index]}`)
              .text(`  Sales: ${monthlyTrends.sales[index]}`)
              .text(`  Users: ${monthlyTrends.users[index]}`)
              .moveDown(0.5);
          });
        } else {
          throw new Error("Unsupported data format for PDF export");
        }

        doc.end();
      } catch (err: any) {
        doc.end();
        reject(new Error(`PDF generation failed: ${err.message}`));
      }
    });
  }

  async generateXLSX(data: ExportableData): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();

    if ("overview" in data && "products" in data && "users" in data) {
      // AllAnalytics
      const { overview, products, users } = data as AllAnalytics;

      // Overview Sheet
      const overviewSheet = workbook.addWorksheet("Overview");
      overviewSheet.columns = [
        { header: "Metric", key: "metric", width: 30 },
        { header: "Value", key: "value", width: 20 },
      ];
      overviewSheet.addRows([
        { metric: "Total Revenue ($)", value: overview.totalRevenue },
        { metric: "Total Orders", value: overview.totalOrders },
        { metric: "Total Sales", value: overview.totalSales },
        { metric: "Total Users", value: overview.totalUsers },
        {
          metric: "Average Order Value ($)",
          value: overview.averageOrderValue,
        },
      ]);
      overviewSheet.addRow([]); // Spacer
      overviewSheet.addRow(["Changes"]);
      overviewSheet.addRows([
        {
          metric: "Revenue Change (%)",
          value: overview.changes.revenue || "N/A",
        },
        {
          metric: "Orders Change (%)",
          value: overview.changes.orders || "N/A",
        },
        { metric: "Sales Change (%)", value: overview.changes.sales || "N/A" },
        { metric: "Users Change (%)", value: overview.changes.users || "N/A" },
        {
          metric: "AOV Change (%)",
          value: overview.changes.averageOrderValue || "N/A",
        },
      ]);
      overviewSheet.addRow([]); // Spacer
      overviewSheet.addRow(["Monthly Trends"]);
      overviewSheet.addRow([
        "Month",
        "Revenue ($)",
        "Orders",
        "Sales",
        "Users",
      ]);
      overview.monthlyTrends.labels.forEach((label: string, index: number) => {
        overviewSheet.addRow([
          label,
          overview.monthlyTrends.revenue[index],
          overview.monthlyTrends.orders[index],
          overview.monthlyTrends.sales[index],
          overview.monthlyTrends.users[index],
        ]);
      });

      // Products Sheet
      const productsSheet = workbook.addWorksheet("Products");
      productsSheet.columns = [
        { header: "ID", key: "id", width: 30 },
        { header: "Product Name", key: "name", width: 30 },
        { header: "Quantity Sold", key: "quantity", width: 15 },
        { header: "Revenue ($)", key: "revenue", width: 15 },
      ];
      products.forEach((item) => {
        productsSheet.addRow({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          revenue: item.revenue,
        });
      });

      // Users Sheet
      const usersSheet = workbook.addWorksheet("Users");
      usersSheet.columns = [
        { header: "Metric", key: "metric", width: 30 },
        { header: "Value", key: "value", width: 20 },
      ];
      usersSheet.addRows([
        { metric: "Total Users", value: users.totalUsers },
        { metric: "Total Revenue ($)", value: users.totalRevenue },
        { metric: "Retention Rate (%)", value: users.retentionRate },
        { metric: "Average Lifetime Value ($)", value: users.lifetimeValue },
        { metric: "Repeat Purchase Rate (%)", value: users.repeatPurchaseRate },
        { metric: "Average Engagement Score", value: users.engagementScore },
        { metric: "Users Change (%)", value: users.changes.users || "N/A" },
      ]);
      usersSheet.addRow([]); // Spacer
      usersSheet.addRow(["Top Users"]);
      usersSheet.addRow([
        "Rank",
        "Name",
        "Email",
        "Order Count",
        "Total Spent ($)",
        "Engagement Score",
      ]);
      users.topUsers.forEach((user: any, index: number) => {
        usersSheet.addRow([
          index + 1,
          user.name,
          user.email,
          user.orderCount,
          user.totalSpent,
          user.engagementScore,
        ]);
      });

      // Interaction Trends Sheet
      const trendsSheet = workbook.addWorksheet("Interaction Trends");
      trendsSheet.columns = [
        { header: "Month", key: "month", width: 20 },
        { header: "Views", key: "views", width: 15 },
        { header: "Clicks", key: "clicks", width: 15 },
        { header: "Others", key: "others", width: 15 },
      ];
      users.interactionTrends.labels.forEach((label: string, index: number) => {
        trendsSheet.addRow({
          month: label,
          views: users.interactionTrends.views[index],
          clicks: users.interactionTrends.clicks[index],
          others: users.interactionTrends.others[index],
        });
      });
    } else if (Array.isArray(data)) {
      // ProductPerformance
      const productsSheet = workbook.addWorksheet("Products");
      productsSheet.columns = [
        { header: "ID", key: "id", width: 30 },
        { header: "Product Name", key: "name", width: 30 },
        { header: "Quantity Sold", key: "quantity", width: 15 },
        { header: "Revenue ($)", key: "revenue", width: 15 },
      ];
      data.forEach((item) => {
        productsSheet.addRow({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          revenue: item.revenue,
        });
      });
    } else if ("totalUsers" in data && "topUsers" in data) {
      // UserAnalytics
      const {
        totalUsers,
        totalRevenue,
        retentionRate,
        lifetimeValue,
        repeatPurchaseRate,
        engagementScore,
        changes,
        topUsers,
        interactionTrends,
      } = data as UserAnalytics;
      const overviewSheet = workbook.addWorksheet("Overview");
      overviewSheet.columns = [
        { header: "Metric", key: "metric", width: 30 },
        { header: "Value", key: "value", width: 20 },
      ];
      overviewSheet.addRows([
        { metric: "Total Users", value: totalUsers },
        { metric: "Total Revenue ($)", value: totalRevenue },
        { metric: "Retention Rate (%)", value: retentionRate },
        { metric: "Average Lifetime Value ($)", value: lifetimeValue },
        { metric: "Repeat Purchase Rate (%)", value: repeatPurchaseRate },
        { metric: "Average Engagement Score", value: engagementScore },
        { metric: "Users Change (%)", value: changes.users || "N/A" },
      ]);
      overviewSheet.addRow([]); // Spacer
      overviewSheet.addRow(["Top Users"]);
      overviewSheet.addRow([
        "Rank",
        "Name",
        "Email",
        "Order Count",
        "Total Spent ($)",
        "Engagement Score",
      ]);
      topUsers.forEach((user: any, index: number) => {
        overviewSheet.addRow([
          index + 1,
          user.name,
          user.email,
          user.orderCount,
          user.totalSpent,
          user.engagementScore,
        ]);
      });

      const trendsSheet = workbook.addWorksheet("Interaction Trends");
      trendsSheet.columns = [
        { header: "Month", key: "month", width: 20 },
        { header: "Views", key: "views", width: 15 },
        { header: "Clicks", key: "clicks", width: 15 },
        { header: "Others", key: "others", width: 15 },
      ];
      interactionTrends.labels.forEach((label: string, index: number) => {
        trendsSheet.addRow({
          month: label,
          views: interactionTrends.views[index],
          clicks: interactionTrends.clicks[index],
          others: interactionTrends.others[index],
        });
      });
    } else {
      // AnalyticsOverview
      const {
        totalRevenue,
        totalOrders,
        totalSales,
        totalUsers,
        averageOrderValue,
        changes,
        monthlyTrends,
      } = data as AnalyticsOverview;
      const overviewSheet = workbook.addWorksheet("Overview");
      overviewSheet.columns = [
        { header: "Metric", key: "metric", width: 30 },
        { header: "Value", key: "value", width: 20 },
      ];
      overviewSheet.addRows([
        { metric: "Total Revenue ($)", value: totalRevenue },
        { metric: "Total Orders", value: totalOrders },
        { metric: "Total Sales", value: totalSales },
        { metric: "Total Users", value: totalUsers },
        { metric: "Average Order Value ($)", value: averageOrderValue },
      ]);
      overviewSheet.addRow([]); // Spacer
      overviewSheet.addRow(["Changes"]);
      overviewSheet.addRows([
        { metric: "Revenue Change (%)", value: changes.revenue || "N/A" },
        { metric: "Orders Change (%)", value: changes.orders || "N/A" },
        { metric: "Sales Change (%)", value: changes.sales || "N/A" },
        { metric: "Users Change (%)", value: changes.users || "N/A" },
        { metric: "AOV Change (%)", value: changes.averageOrderValue || "N/A" },
      ]);
      overviewSheet.addRow([]); // Spacer
      overviewSheet.addRow(["Monthly Trends"]);
      overviewSheet.addRow([
        "Month",
        "Revenue ($)",
        "Orders",
        "Sales",
        "Users",
      ]);
      monthlyTrends.labels.forEach((label: string, index: number) => {
        overviewSheet.addRow([
          label,
          monthlyTrends.revenue[index],
          monthlyTrends.orders[index],
          monthlyTrends.sales[index],
          monthlyTrends.users[index],
        ]);
      });
    }

    workbook.eachSheet((sheet) => {
      sheet.getRow(1).font = { bold: true };
      sheet.eachRow((row) => {
        row.alignment = { vertical: "middle", horizontal: "left" };
      });
    });

    return workbook.xlsx.writeBuffer() as Promise<Buffer>;
  }
}

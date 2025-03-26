class ApiFeatures {
  private queryOptions: any;
  private queryString: Record<string, any>;

  constructor(queryString: Record<string, any>) {
    this.queryOptions = {};
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const filters: any = {};
    for (const key in queryObj) {
      if (queryObj[key]) {
        if (Array.isArray(queryObj[key])) {
          filters[key] = { in: queryObj[key] };
        } else if (typeof queryObj[key] === "string") {
          filters[key] = { in: queryObj[key].split(",") };
        } else {
          filters[key] = { contains: queryObj[key], mode: "insensitive" };
        }
      }
    }

    this.queryOptions.where = filters;
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort
        .split(",")
        .map((sortField: string) => {
          const [field, order] = sortField.split(":");
          return { [field]: order || "asc" };
        });
      this.queryString.orderBy = sortBy;
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields
        .split(",")
        .reduce((acc: any, field: string) => {
          acc[field] = true;
          return acc;
        }, {} as Record<string, boolean>);
      this.queryOptions.select = fields;
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;

    this.queryOptions.skip = skip;
    this.queryOptions.take = limit;
    return this;
  }

  build() {
    return this.queryOptions;
  }
}

export default ApiFeatures;

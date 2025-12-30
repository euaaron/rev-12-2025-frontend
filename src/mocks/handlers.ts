import { graphql, HttpResponse } from "msw";

import { ICar } from "../types/ICar";

const carList: ICar[] = [
  {
    id: "1",
    make: "Audi",
    model: "Q5",
    year: 2023,
    color: "Blue",
    mobile:
      "https://media.audi.com/is/image/audi/nemo/uk/models/q5-tfsi-e/2023-trims/mobile/q5_sportback_tfsie_sport_1280x1080px.png?width=300",
    tablet:
      "https://media.audi.com/is/image/audi/nemo/uk/models/q5-tfsi-e/2023-trims/mobile/q5_sportback_tfsie_sport_1280x1080px.png?width=900",
    desktop:
      "https://media.audi.com/is/image/audi/nemo/uk/models/q5-tfsi-e/2023-trims/mobile/q5_sportback_tfsie_sport_1280x1080px.png?width=1280",
  },
  {
    id: "2",
    make: "Audi",
    model: "A3",
    year: 2022,
    color: "Red",
    mobile:
      "https://nar.media.audi.com/is/image/audinar/nemo/ca/Models/a3/MY25/1920x1920-A3-P1.jpg?width=300",
    tablet:
      "https://nar.media.audi.com/is/image/audinar/nemo/ca/Models/a3/MY25/1920x1920-A3-P1.jpg?width=900",
    desktop:
      "https://nar.media.audi.com/is/image/audinar/nemo/ca/Models/a3/MY25/1920x1920-A3-P1.jpg?width=1200",
  },
  {
    id: "3",
    make: "Audi",
    model: "R8",
    year: 2024,
    color: "White",
    mobile:
      "https://www.intotheblue.co.uk/images/Suppliers/6thGear/6th-Gear-Experience---Audi-Thrill-2024/r8-white-600X600-1.jpg?width=300",
    tablet:
      "https://www.intotheblue.co.uk/images/Suppliers/6thGear/6th-Gear-Experience---Audi-Thrill-2024/r8-white-600X600-1.jpg?width=900",
    desktop:
      "https://www.intotheblue.co.uk/images/Suppliers/6thGear/6th-Gear-Experience---Audi-Thrill-2024/r8-white-600X600-1.jpg?width=1200",
  },
  {
    id: "4",
    make: "Volkswagen",
    model: "Nivus",
    year: 2025,
    color: "Blue",
    mobile:
      "https://assets.volkswagen.com/is/image/volkswagenag/banner_nivus_1920x1080_2?Zml0PWNyb3AsMSZmbXQ9d2VicCZxbHQ9Nzkmd2lkPTgwMCZoZWk9NjAwJmFsaWduPTAuMDAsMC4wMCZiZmM9b2ZmJjQ3M2E=",
    tablet:
      "https://assets.volkswagen.com/is/image/volkswagenag/banner_nivus_1920x1080_2?Zml0PWNyb3AsMSZmbXQ9d2VicCZxbHQ9Nzkmd2lkPTgwMCZoZWk9NjAwJmFsaWduPTAuMDAsMC4wMCZiZmM9b2ZmJjQ3M2E=",
    desktop:
      "https://assets.volkswagen.com/is/image/volkswagenag/banner_nivus_1920x1080_2?Zml0PWNyb3AsMSZmbXQ9d2VicCZxbHQ9Nzkmd2lkPTgwMCZoZWk9NjAwJmFsaWduPTAuMDAsMC4wMCZiZmM9b2ZmJjQ3M2E=",
  },
  {
    id: "5",
    make: "Volkswagen",
    model: "Polo",
    year: 2025,
    color: "Red",
    mobile:
      "https://assets.volkswagen.com/is/image/volkswagenag/MeuVW_nord_Polo_1920x1080?Zml0PWNyb3AsMSZmbXQ9d2VicCZxbHQ9Nzkmd2lkPTgwMCZoZWk9NjAwJmFsaWduPTAuMDAsMC4wMCZiZmM9b2ZmJjQ3M2E=",
    tablet:
      "https://assets.volkswagen.com/is/image/volkswagenag/MeuVW_nord_Polo_1920x1080?Zml0PWNyb3AsMSZmbXQ9d2VicCZxbHQ9Nzkmd2lkPTgwMCZoZWk9NjAwJmFsaWduPTAuMDAsMC4wMCZiZmM9b2ZmJjQ3M2E=",
    desktop:
      "https://assets.volkswagen.com/is/image/volkswagenag/MeuVW_nord_Polo_1920x1080?Zml0PWNyb3AsMSZmbXQ9d2VicCZxbHQ9Nzkmd2lkPTgwMCZoZWk9NjAwJmFsaWduPTAuMDAsMC4wMCZiZmM9b2ZmJjQ3M2E=",
  },
  {
    id: "6",
    make: "Volkswagen",
    model: "T-Cross",
    year: 2025,
    color: "Gray",
    mobile:
      "https://assets.volkswagen.com/is/image/volkswagenag/T-cross-extreme-banner?Zml0PWNyb3AsMSZmbXQ9d2VicCZxbHQ9Nzkmd2lkPTgwMCZoZWk9NjAwJmFsaWduPTAuMDAsMC4wMCZiZmM9b2ZmJjQ3M2E=",
    tablet:
      "https://assets.volkswagen.com/is/image/volkswagenag/T-cross-extreme-banner?Zml0PWNyb3AsMSZmbXQ9d2VicCZxbHQ9Nzkmd2lkPTgwMCZoZWk9NjAwJmFsaWduPTAuMDAsMC4wMCZiZmM9b2ZmJjQ3M2E=",
    desktop:
      "https://assets.volkswagen.com/is/image/volkswagenag/T-cross-extreme-banner?Zml0PWNyb3AsMSZmbXQ9d2VicCZxbHQ9Nzkmd2lkPTgwMCZoZWk9NjAwJmFsaWduPTAuMDAsMC4wMCZiZmM9b2ZmJjQ3M2E=",
  },
  {
    id: "7",
    make: "Honda",
    model: "Civic Sedan",
    year: 2026,
    color: "Red",
    mobile:
      "https://automobiles.honda.com/-/media/Honda-Automobiles/Vehicles/2026/civic-sedan/Hero/MY26_Civic-Sedan_VLP-Hero_2000x1124.jpg",
    tablet:
      "https://automobiles.honda.com/-/media/Honda-Automobiles/Vehicles/2026/civic-sedan/Hero/MY26_Civic-Sedan_VLP-Hero_2000x1124.jpg",
    desktop:
      "https://automobiles.honda.com/-/media/Honda-Automobiles/Vehicles/2026/civic-sedan/Hero/MY26_Civic-Sedan_VLP-Hero_2000x1124.jpg",
  },
  {
    id: "8",
    make: "BMW",
    model: "Vision Neue Klasse",
    year: 2025,
    color: "White",
    mobile:
      "https://www.bmw.com.br/content/dam/bmw/common/topics/fascination-bmw/concept-vehicles/navigation/bmw_neue_klasse_vision_modelcard.png.asset.1693582906615.png",
    tablet:
      "https://www.bmw.com.br/content/dam/bmw/common/topics/fascination-bmw/concept-vehicles/navigation/bmw_neue_klasse_vision_modelcard.png.asset.1693582906615.png",
    desktop:
      "https://www.bmw.com.br/content/dam/bmw/common/topics/fascination-bmw/concept-vehicles/navigation/bmw_neue_klasse_vision_modelcard.png.asset.1693582906615.png",
  },
];

function isNullOrEmpty(value: unknown) {
  return value === undefined || value === "" || value === null;
}

function includesInsensitive(haystack: unknown, needle: unknown) {
  const h = String(haystack ?? "").toLowerCase();
  const n = String(needle ?? "").trim().toLowerCase();
  if (!n) return true;
  return h.includes(n);
}

export const handlers = [
  graphql.query("GetCars", ({ variables }) => {
    const filtered = carList.filter((item) => {
      let match = 0;
      if (
        isNullOrEmpty(variables?.make) ||
        includesInsensitive(item.make, variables.make)
      ) {
        match++;
      }
      if (
        isNullOrEmpty(variables?.model) ||
        includesInsensitive(item.model, variables.model)
      ) {
        match++;
      }
      if (
        isNullOrEmpty(variables?.year) ||
        item.year === Number(variables.year)
      ) {
        match++;
      }
      if (
        isNullOrEmpty(variables?.color) ||
        includesInsensitive(item.color, variables.color)
      ) {
        match++;
      }
      if (match === 4) return item;
    });

    const sortBy = String(variables?.sortBy ?? "");
    const sortDir = String(variables?.sortDir ?? "asc").toLowerCase();
    const dir = sortDir === "desc" ? -1 : 1;

    const cars = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "make":
          return String(a.make ?? "").localeCompare(String(b.make ?? "")) * dir;
        case "model":
          return String(a.model ?? "").localeCompare(String(b.model ?? "")) * dir;
        case "color":
          return String(a.color ?? "").localeCompare(String(b.color ?? "")) * dir;
        case "year":
          return ((a.year ?? 0) - (b.year ?? 0)) * dir;
        default:
          return 0;
      }
    });

    const totalCount = cars.length;

    const rawPage = Number(variables?.page);
    const rawPageSize = Number(variables?.pageSize);
    const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
    const pageSize =
      Number.isFinite(rawPageSize) && rawPageSize > 0
        ? Math.floor(rawPageSize)
        : 25;

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = start >= 0 ? cars.slice(start, end) : cars.slice(0, pageSize);

    return HttpResponse.json({
      data: {
        carsPage: {
          totalCount,
          items,
        },
      },
    });
  }),

  graphql.mutation("AddNewCar", ({ variables }) => {
    const car: ICar = {
      id: String(carList.length + 1),
      mobile: "",
      tablet: "",
      desktop: "",
      ...variables.params,
    };

    carList.push(car);
    return HttpResponse.json({ data: { createCar: car } });
  }),
];

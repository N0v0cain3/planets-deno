import { join } from "https://deno.land/std/path/mod.ts";
import { BufReader } from "https://deno.land/std/io/bufio.ts";
import { parse } from "https://deno.land/std/encoding/csv.ts";

interface Planet {
  [key: string]: string;
}

async function loadPlanetsData() {
  const path = join("csv", "original.csv");
  const file = await Deno.open(path);

  const bufReader = new BufReader(file);
  const result = await parse(bufReader, {
    header: true,
    comment: "#",
  });

  Deno.close(file.rid);

  const planets = (result as Array<Planet>).filter((p) => {
    const planataryRadius = Number(p["koi_prad"]);
    const stellarMass = Number(p["koi_smass"]);
    const stellarRadius = Number(p["koi_srad"]);
    return p["koi_disposition"] === "CONFIRMED" && planataryRadius > 0.5 &&
      planataryRadius < 1.5 && stellarMass > 0.78 && stellarMass < 1.04 &&
      stellarRadius > 0.99 && stellarRadius < 1.01;
  });

  return planets;
}

const newEarths = await loadPlanetsData();
console.log(`${newEarths.length} habitable planets found`);

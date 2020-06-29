import { join } from "https://deno.land/std/path/mod.ts";
import { BufReader } from "https://deno.land/std/io/bufio.ts";
import { parse } from "https://deno.land/std/encoding/csv.ts";

async function loadPlanetsData() {
  const path = join("csv", "original.csv");
  const file = await Deno.open(path);

  const bufReader = new BufReader(file);
  const result = await parse(bufReader, {
    header: true,
    comment: "#",
  });

  Deno.close(file.rid);

  const planets = result.filter((p: any) => {
    const planataryRadius = p["koi_prad"];
    const stellarMass = p["koi_smass"];
    const stellarRadius = p["koi_srad"];
    return p["koi_disposition"] === "CONFIRMED" && planataryRadius > 0.5 &&
      planataryRadius < 1.5 && stellarMass > 0.78 && stellarMass < 1.04 &&
      stellarRadius > 0.99 && stellarRadius < 1.01;
  });

  return result;
}

const newEarths = await loadPlanetsData();
console.log(`${newEarths.length} habitable planets found`);

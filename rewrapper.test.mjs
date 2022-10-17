import { assertEquals } from "https://deno.land/std@0.159.0/testing/asserts.ts";
import rewrapper from "./rewrapper.mjs";

const COLUMN_LENGTH_FOR_TESTING = 100;

for await (const dirEntry of Deno.readDir("testcases/")) {
  if (dirEntry.isFile && dirEntry.name.endsWith(".html") && !dirEntry.name.endsWith(".out.html")) {
    Deno.test(dirEntry.name, async () => {
      const input = await Deno.readTextFile("testcases/" + dirEntry.name);
      const expected = await Deno.readTextFile("testcases/" + dirEntry.name.replace(".html", ".out.html"));
      const actual = rewrapper(input, COLUMN_LENGTH_FOR_TESTING);

      assertEquals(actual, expected);
    });
  }
}

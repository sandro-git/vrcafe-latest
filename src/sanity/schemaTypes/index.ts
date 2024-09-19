import type{ SchemaTypeDefinition } from "sanity";
import { escapeGames } from "./games";

export const schema: SchemaTypeDefinition[] = [escapeGames];
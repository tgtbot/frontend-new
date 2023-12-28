import { atom } from "jotai";
import type SDK from "@twa-dev/sdk";

export const sdkAtom = atom<typeof SDK | undefined>(undefined);

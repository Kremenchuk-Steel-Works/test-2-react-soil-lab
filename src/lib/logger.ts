import log from "loglevel"
import { DEBUG } from "../config/env"

log.setLevel(DEBUG ? "debug" : "warn")

export const logger = log

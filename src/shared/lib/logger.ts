import log from "loglevel"
import { DEBUG } from '@/shared/config/env'

log.setLevel(DEBUG ? "debug" : "warn")

export const logger = log

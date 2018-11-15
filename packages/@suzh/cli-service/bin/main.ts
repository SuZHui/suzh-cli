#!/usr/bin/env node

import { Service } from "../lib/Service";

const service = new Service(process.cwd());
service.run();
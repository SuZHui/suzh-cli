#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Service_1 = require("../lib/Service");
var service = new Service_1.Service(process.cwd());
service.run();

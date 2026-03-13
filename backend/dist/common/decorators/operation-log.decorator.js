"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationLog = exports.OPERATION_LOG_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.OPERATION_LOG_KEY = 'operation_log';
const OperationLog = (module, action) => (0, common_1.SetMetadata)(exports.OPERATION_LOG_KEY, { module, action });
exports.OperationLog = OperationLog;
//# sourceMappingURL=operation-log.decorator.js.map
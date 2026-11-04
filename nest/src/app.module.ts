import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './modules/user/user.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ScheduleModule } from './modules/schedule/schedule.module.js';
import { AppException } from './filter/exception/app.exception.js';
import { ConfigModule } from '@nestjs/config';
import { TransformInterceptor } from './interceptor/transform.interceptor.js';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from './filter/global-exception.filter.js';
import { FlightService } from './modules/flight/flight.service.js';
import { FlightController } from './modules/flight/flight.controller.js';
import { FlightModule } from './modules/flight/flight.module.js';
import { DocumentModule } from './modules/document/document.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY as string,
      appSecret: process.env.JWT_SECRET as string,
      serviceId: 'nest',
    }),
    UserModule,
    AuthModule,
    ScheduleModule,
    FlightModule,
    DocumentModule,
  ],
  controllers: [AppController, FlightController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    FlightService,
  ],
})
export class AppModule {}

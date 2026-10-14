import {
  Injectable,
  Logger,
  OnModuleInit,
  OnApplicationBootstrap,
  OnModuleDestroy,
  BeforeApplicationShutdown,
  OnApplicationShutdown,
} from '@nestjs/common';

@Injectable()
export class LifecycleDemoService
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnModuleDestroy,
    BeforeApplicationShutdown,
    OnApplicationShutdown
{
  private readonly logger = new Logger(LifecycleDemoService.name);
  private timer?: ReturnType<typeof setInterval>;
  private acceptingWork = false;
  private ticks = 0;

  //   Nest js calls this method after the module has been initialized
  onModuleInit(): void {
    this.logger.log(
      '1. onModuleInit: host module dependencies have been resolved',
    );
  }

  //   Nestjs calls this after modules have been initialized and before http listening begins
  onApplicationBootstrap(): void {
    this.acceptingWork = true;
    this.timer = setInterval(() => {
      this.ticks++;
      this.logger.log(`Background Timer Tick ${this.ticks}`);
    }, 5000);
    this.logger.log('2. onApplicationBootstrap: Timer started');
    this.logger.log(`Demo process PID: ${process.pid}`);
  }

  //   This is the first shutdown phase: here we can stop accepting work and clean up any resources
  onModuleDestroy(): void {
    this.acceptingWork = false;
    if (this.timer !== undefined) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
    this.logger.log(
      '3. onModuleDestroy: Stopped accepting work and timer stopped',
    );
  }

  //   Runs after onModuleDestroy, before application shutdown
  //   Signals are: SIGINT, SIGTERM, and undefined
  beforeApplicationShutdown(signal?: string): void {
    this.logger.log(
      `4. beforeApplicationShutdown: Signal received: signal = ${signal ?? 'app.close()'}`,
    );
  }

  //   Runs after beforeApplicationShutdown, before application shutdown
  onApplicationShutdown(signal?: string): void {
    this.logger.log(
      `5. onApplicationShutdown: Signal received: signal = ${signal ?? 'app.close()'}`,
    );
  }

  snapshot() {
    return {
      pid: process.pid,
      acceptingWork: this.acceptingWork,
      timerActive: this.timer !== undefined,
      ticks: this.ticks,
    };
  }
}

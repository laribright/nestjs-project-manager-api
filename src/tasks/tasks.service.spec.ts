import { describe, expect, it, jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotFoundException } from '@nestjs/common';

import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';
import { TASKS_OPTIONS } from './tasks.constants';

describe('TasksService', () => {
  it('returns not found when the owner-scoped lookup has no match', async () => {
    const repository = {
      findOne: jest
        .fn<TasksRepository['findOne']>()
        .mockResolvedValue(undefined),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useValue: repository },
        { provide: TASKS_OPTIONS, useValue: { defaultStatus: 'todo' } },
        { provide: EventEmitter2, useValue: { emitAsync: jest.fn() } },
      ],
    }).compile();

    try {
      const service = moduleRef.get(TasksService);
      await expect(service.findOne(999, 42)).rejects.toBeInstanceOf(
        NotFoundException,
      );

      expect(repository.findOne).toHaveBeenCalledWith(999, 42);
    } finally {
      await moduleRef.close();
    }
  });
});

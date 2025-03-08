import { Test, TestingModule } from '@nestjs/testing';
import { ContentfulController } from './contentful.controller';
import { ContentfulTask } from '../tasks/contentful.task';

describe('ContentfulController', () => {
  let contentfulController: ContentfulController;
  let contentfulTask: jest.Mocked<ContentfulTask>;

  beforeEach(async () => {
    contentfulTask = {
      _fetchAndInsertProducts: jest.fn(),
    } as unknown as jest.Mocked<ContentfulTask>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentfulController],
      providers: [{ provide: ContentfulTask, useValue: contentfulTask }],
    }).compile();

    contentfulController =
      module.get<ContentfulController>(ContentfulController);
  });

  describe('fetchProducts', () => {
    it('should call _fetchAndInsertProducts and return success message', async () => {
      contentfulTask._fetchAndInsertProducts.mockResolvedValueOnce(undefined);

      const result = await contentfulController.fetchProducts();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(contentfulTask._fetchAndInsertProducts).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Productos actualizados desde Contentful.',
      });
    });
  });
});

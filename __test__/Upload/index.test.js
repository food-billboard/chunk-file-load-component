import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Upload as ChunkUpload } from 'chunk-file-upload';
import { Upload } from '../../src';
import {
  exitDataFn,
  uploadFn,
  completeFn,
  sleep,
  uploadTask,
  FILE_SIZE,
  FILE_NAME,
  FILE_TYPE,
  promisify,
} from './utils';

global.URL.createObjectURL = jest.fn(() => 'faker createObjectURL');

jest.mock('nanoid', () => {
  return {
    nanoid: () => Math.random(),
  };
});

describe(`Upload Component test`, () => {
  test(`simple test`, async () => {
    await new Promise(async (resolve, reject) => {
      const props = {
        viewType: 'list',
        request: {
          exitDataFn,
          uploadFn,
          completeFn,
          callback(err, value) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          },
        },
      };

      const wrapper = mount(<Upload {...props} />);

      await act(async () => {
        await sleep(100);
        wrapper.find('input').simulate('change', {
          target: {
            files: [
              ChunkUpload.arraybuffer2file(
                new ArrayBuffer(FILE_SIZE),
                FILE_NAME,
                {
                  type: FILE_TYPE,
                },
              ),
            ],
          },
        });

        await sleep(1000);

        wrapper.update();
      });

      uploadTask(wrapper);
    });
  });
});

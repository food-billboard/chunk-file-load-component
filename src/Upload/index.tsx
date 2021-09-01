import React, {
  memo,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
  useState,
  useEffect,
  createContext,
} from 'react';
import classnames from 'classnames';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { merge, noop } from 'lodash-es';
import { nanoid } from 'nanoid';
import { Upload as ChunkFileUpload } from 'chunk-file-upload';
import {
  Upload as UploadInstanceType,
  TRequestType,
  TLifecycle,
} from 'chunk-file-upload/src';
import Container from './components/Container';
import ViewFile from './components/ViewFile';
import { DEFAULT_DROP_PROPS, LIFE_CYCLE_ENUM } from './constants';
import { customAction, propsValueFormat, Emitter } from './utils';
import {
  UploadProps,
  UploadInstance,
  WrapperFile,
  UploadContextType,
} from './type';
import { useStateChange } from '@/utils';
import './index.less';

export { request } from '../utils/request';
export * from './type';

const emitter = new Emitter();

function lifecycleFormat(lifecycle: TLifecycle) {
  return LIFE_CYCLE_ENUM.reduce(function (acc, cycle) {
    const action = (lifecycle as any)[cycle];
    acc[cycle] = function (params: any, response: any) {
      emitter.emit(params.name, params, response, this);
      return action?.(params);
    };
    return acc;
  }, {} as any);
}

export const UploadContext = createContext<UploadContextType>({
  instance: {} as any,
  emitter,
  locale: {},
  setValue: noop,
});

const { Provider } = UploadContext;

const Upload = memo(
  forwardRef<UploadInstance, UploadProps>((props, ref) => {
    const [files, setFiles] = useStateChange<WrapperFile[]>([]);
    const [uploadInstance, setUploadInstance] = useState<UploadInstanceType>();

    const {
      className,
      style,
      showUploadList = true,
      immediately = true,
      request,
      lifecycle = {},
      actionUrl,
      method,
      withCredentials = true,
      containerRender,
      viewType = 'list',
      viewStyle,
      viewClassName,
      defaultValue,
      value,
      onChange,
      onRemove,
      locale,
      iconRender,
      itemRender,
      previewFile,
      ...nextProps
    } = props;

    const onError = useCallback((request: TRequestType) => {
      const { callback, ...nextRequest } = request;
      return {
        ...nextRequest,
        callback(error: any, value: any) {
          if (!!error) {
            setFiles((prev) => {
              return prev.map((item) => {
                const { name } = item;
                if (value !== name) return item;
                return merge({}, item, {
                  error,
                });
              });
            });
          }
        },
      };
    }, []);

    const taskGenerate = useCallback(
      (file: File) => {
        if (actionUrl) {
          const { request, ...nextAction } = customAction({
            url: actionUrl,
            instance: uploadInstance!,
            withCredentials: !!withCredentials,
          });
          return {
            request: onError(request as TRequestType),
            ...nextAction,
            file: {
              file,
            },
          };
        }
        return {
          request: onError(request as TRequestType),
          file: {
            file,
          },
        };
      },
      [request, actionUrl, withCredentials, onError],
    );

    const addTask = useCallback(
      (files: File | File[]) => {
        const realFiles = Array.isArray(files) ? files : [files];
        const wrapperFiles = realFiles.reduce<{
          wrapperFiles: WrapperFile[];
          errorFiles: File[];
        }>(
          (acc, file: File) => {
            const tasks = uploadInstance?.add(taskGenerate(file));
            if (Array.isArray(tasks) && tasks.length === 1) {
              const [name] = tasks;
              const task = uploadInstance!.getTask(name);
              const id = nanoid();
              const wrapperTask: WrapperFile = {
                originFile: file,
                name,
                id,
                task: task || undefined,
                local: {
                  type: 'local',
                  value: {
                    preview: URL.createObjectURL(file),
                    fileId: id,
                    fileSize: file.size,
                    filename: file.name,
                  },
                },
                getStatus() {
                  return task!.status;
                },
              };
              acc.wrapperFiles.push(wrapperTask);
              if (immediately) uploadInstance!.deal(name);
            } else {
              acc.errorFiles.push(file);
            }
            return acc;
          },
          {
            wrapperFiles: [],
            errorFiles: [],
          },
        );
        return wrapperFiles;
      },
      [uploadInstance, request, taskGenerate],
    );

    const onDrop: DropzoneOptions['onDrop'] = useCallback(
      (acceptedFiles, fileRejections) => {
        const { wrapperFiles, errorFiles } = addTask(acceptedFiles);
        if (!!errorFiles.length) console.error('some file error');
        setFiles((prev) => {
          return [...prev, ...wrapperFiles];
        });
      },
      [addTask],
    );

    const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragAccept,
      isDragReject,
      isFocused,
      isFileDialogActive,
    } = useDropzone(
      merge({}, DEFAULT_DROP_PROPS, {
        onDrop,
        ...nextProps,
      }),
    );

    const getTask = useCallback(
      (name) => {
        return uploadInstance!.getTask(name);
      },
      [uploadInstance],
    );

    useImperativeHandle(
      ref,
      () => {
        return {
          getTask,
        };
      },
      [getTask],
    );

    const onFilesChange = useCallback((files: WrapperFile[]) => {
      setFiles(files);
    }, []);

    const fileDomList = useMemo(() => {
      return (
        <ViewFile
          instance={uploadInstance!}
          style={viewStyle}
          className={viewClassName}
          value={files}
          viewType={viewType}
          showUploadList={showUploadList}
          onChange={onFilesChange}
          onRemove={onRemove}
          iconRender={iconRender}
          itemRender={itemRender}
          previewFile={previewFile}
        />
      );
    }, [
      files,
      viewType,
      uploadInstance,
      showUploadList,
      viewClassName,
      viewStyle,
      onRemove,
      itemRender,
    ]);

    const contextValue = useMemo(() => {
      return {
        instance: uploadInstance!,
        emitter,
        locale,
        setValue: setFiles,
      };
    }, [uploadInstance, locale]);

    useEffect(
      () => () => {
        files.forEach((file) => {
          try {
            URL.revokeObjectURL(file.local?.value?.preview as string);
          } catch (err) {}
        });
      },
      [files],
    );

    useEffect(() => {
      if (!!uploadInstance) return;
      const instance = new ChunkFileUpload({
        lifecycle: lifecycleFormat(lifecycle),
      });
      setUploadInstance(instance);
    }, [lifecycle, uploadInstance]);

    useEffect(() => {
      const formatDefaultValue = propsValueFormat(defaultValue);
      setFiles(formatDefaultValue);
    }, []);

    useEffect(() => {
      if (value !== undefined) {
        const formatValue = propsValueFormat(defaultValue);
        setFiles(formatValue);
      }
    }, [value]);

    useEffect(() => {
      onChange?.(files);
    }, [files]);

    return (
      <Provider value={contextValue}>
        <div
          className={classnames('chunk-upload-container', {
            ['chunk-upload-container-list']: viewType === 'list',
            ['chunk-upload-container-card']: viewType === 'card',
          })}
        >
          <Container
            viewType={viewType}
            isDragAccept={isDragAccept}
            isDragActive={isDragActive}
            isDragReject={isDragReject}
            isFileDialogActive={isFileDialogActive}
            isFocused={isFocused}
            style={style}
            className={className}
            locale={locale}
            containerRender={containerRender}
            root={getRootProps<any>({})}
            input={getInputProps<any>({})}
            maxFiles={nextProps.maxFiles}
            currentFiles={files.length}
          />
          {!!showUploadList && fileDomList}
        </div>
      </Provider>
    );
  }),
);

export default Upload;

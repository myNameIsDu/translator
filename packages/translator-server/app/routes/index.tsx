import SearchIcon from '@rsuite/icons/Search';
import {
    Panel,
    Table,
    Button,
    SelectPicker,
    InputGroup,
    Input,
    Form,
    type FormInstance,
    Schema,
} from 'rsuite';
import { json, type LoaderFunction } from '@remix-run/node';
import { useFetcher, useLoaderData, useSearchParams, useTransition } from '@remix-run/react';
import React, { useMemo, useState, useRef } from 'react';
import debounce from 'lodash/debounce';
import { matchSorter } from 'match-sorter';
import { readArrayComplete, getAllTextAndId, readObjectComplete, getUnTranslate } from '../helper';

const Colum = Table.Column;
const HeaderCell = Table.HeaderCell;
const Cell = Table.Cell;

const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);

const filterData = [
    {
        value: 'complete',
        label: '已翻译',
    },
    {
        value: 'dead',
        label: '过期翻译',
    },
    {
        value: 'unTranslate',
        label: '未翻译',
    },
] as const;
export type FilterType = typeof filterData[number]['value'];

type DataType = {
    id: string;
    zh: string;
    en?: string;
};

export const loader: LoaderFunction = ({ request }) => {
    const url = new URL(request.url);
    const queryType = (url.searchParams.get('type') || 'complete') as FilterType;
    const queryWord = url.searchParams.get('word') || '';

    let data: DataType[] = [];
    if (queryType === 'complete') {
        data = readArrayComplete();
    } else if (queryType === 'unTranslate') {
        data = getUnTranslate();
    } else if (queryType === 'dead') {
        const { allIds } = getAllTextAndId();
        const originalCompleteData = readObjectComplete();
        let deadKeys: string[] = Object.keys(originalCompleteData).filter(k => !allIds.includes(k));
        data = deadKeys.map(key => ({
            id: key,
            ...originalCompleteData[key],
        }));
    }
    if (queryWord) {
        return json(matchSorter(data, queryWord, { keys: ['zh', 'id', 'en'] }));
    }
    return json(data);
};

export default function Index() {
    const transition = useTransition();
    const deleteMutation = useFetcher();
    const importMutation = useFetcher();
    const editMutation = useFetcher();
    const loaderData = useLoaderData();
    const [searchParams, setSearchParams] = useSearchParams();
    const type = (searchParams.get('type') || 'complete') as FilterType;
    const [searchWord, setSearchWord] = useState(searchParams.get('word') || '');
    const formRef = useRef<FormInstance>();
    const [formValue, setFormValue] = useState<Record<string, DataType | null>>({});
    const formValueRef = useRef(formValue);
    /**
     * rsuite 的 table 会缓存 children，所以会导致在使用 外部的 state(不是 rowData) 时，会多使用旧值渲染一次，导致浏览器会强制把输入框的光标移到最后
     * 所以这里使用 ref 来保存最新的 formValue
     */
    formValueRef.current = formValue;

    const handleTypeChange = (v: string) => {
        handleCancel();
        searchParams.set('type', v);
        setSearchParams(searchParams);
    };
    const refetchWithSearchWord = useMemo(
        () =>
            debounce(v => {
                if (v) {
                    searchParams.set('word', v);
                } else {
                    searchParams.delete('word');
                }
                setSearchParams(searchParams);
            }, 50),
        [searchParams, setSearchParams],
    );
    const handleInputChange = (v: string) => {
        handleCancel();
        setSearchWord(v);
        refetchWithSearchWord(v);
    };

    const downloadUnTranslate = () => {
        const a = document.createElement('a');
        a.href = '/export';
        a.click();
    };

    const handleDelete = (id: string) => {
        deleteMutation.submit({ id }, { method: 'delete', action: '/delete' });
    };

    const handleImport = () => {
        const inputFile = document.createElement('input');
        inputFile.setAttribute('type', 'file');
        inputFile.setAttribute('accept', '.xlsx');
        inputFile.click();
        inputFile.onchange = event => {
            const file = inputFile.files?.[0];
            file &&
                importMutation.submit(
                    { file },
                    { action: '/import', method: 'put', encType: 'multipart/form-data' },
                );
        };
    };

    const handleEdit = (rowData: DataType) => {
        const { id } = rowData;
        setFormValue(prev => ({ ...prev, [id]: rowData }));
    };

    const handleCancel = (id?: string) => {
        formRef.current?.cleanErrors();
        if (id) {
            setFormValue(prev => ({ ...prev, [id]: null }));
        } else {
            setFormValue({});
        }
    };

    const handleSubmit = (id: string) => {
        if (id) {
            const rowData = formValue[id];
            editMutation.submit(rowData, { action: '/edit', method: 'put' });
            handleCancel(id);
        }
    };

    const tableLoading =
        transition.state === 'loading' ||
        editMutation.state === 'submitting' ||
        editMutation.state === 'loading' ||
        deleteMutation.state === 'submitting' ||
        deleteMutation.state === 'loading' ||
        importMutation.state === 'submitting' ||
        importMutation.state === 'loading';

    const importButtonLoading = importMutation.state === 'submitting';

    return (
        <Panel>
            <Form ref={formRef}>
                <div className="flex mb-[30px]">
                    <SelectPicker
                        value={searchParams.get('type') || 'complete'}
                        data={filterData}
                        searchable={false}
                        onChange={handleTypeChange}
                        cleanable={false}
                        className="mr-[20px]"
                    />
                    <InputGroup inside style={{ width: 300 }} className="mr-[20px]">
                        <Input onChange={handleInputChange} value={searchWord} />
                        <InputGroup.Button>
                            <SearchIcon />
                        </InputGroup.Button>
                    </InputGroup>
                    <div className="space-x-[10px]">
                        <Button onClick={downloadUnTranslate} appearance="primary">
                            导出未翻译文案
                        </Button>
                        <Button
                            onClick={handleImport}
                            loading={importButtonLoading}
                            appearance="primary"
                        >
                            导入翻译
                        </Button>
                    </div>
                </div>
                <Table height={800} loading={tableLoading} wordWrap data={loaderData}>
                    <Colum align="left" flexGrow={1} width={450}>
                        <HeaderCell>id(当前词条的唯一标识，默认为中文)</HeaderCell>
                        <Cell>
                            {rowData => {
                                return <pre className="m-[0]">{rowData.id}</pre>;
                            }}
                        </Cell>
                    </Colum>
                    <Colum align="left" fullText flexGrow={1} width={450}>
                        <HeaderCell>中文</HeaderCell>
                        <Cell>
                            {rowData => {
                                const rowDataZh = rowData['zh'];
                                return <pre className="m-[0]">{rowDataZh}</pre>;
                            }}
                        </Cell>
                    </Colum>
                    <Colum align="left" flexGrow={1} width={450}>
                        <HeaderCell>英文</HeaderCell>
                        <Cell>
                            {rowData => {
                                const rowDataId = rowData.id;
                                const rowDataEn = rowData['en'];
                                const rowDataFormValue = formValueRef.current[rowDataId];
                                if (rowDataFormValue) {
                                    return (
                                        <Form.Control
                                            rule={Schema.Types.StringType().isRequired('请输入')}
                                            name="en"
                                            errorPlacement="rightStart"
                                            value={rowDataFormValue?.en}
                                            onChange={value =>
                                                setFormValue(prev => ({
                                                    ...prev,
                                                    [rowDataId]: { ...rowDataFormValue, en: value },
                                                }))
                                            }
                                            accepter={Textarea}
                                        />
                                    );
                                } else {
                                    return <pre className="m-[0]">{rowDataEn}</pre>;
                                }
                            }}
                        </Cell>
                    </Colum>
                    <Colum align="center" width={200}>
                        <HeaderCell>操作</HeaderCell>
                        <Cell style={{ padding: 6 }}>
                            {rowData => {
                                const { id } = rowData;
                                const rowDataFormValue = formValueRef.current[id];
                                return (
                                    <div>
                                        {rowDataFormValue ? (
                                            <>
                                                <Button
                                                    size="sm"
                                                    appearance="link"
                                                    onClick={() => handleSubmit(id)}
                                                >
                                                    保存
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    appearance="link"
                                                    onClick={() => handleCancel(id)}
                                                >
                                                    取消
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    size="sm"
                                                    appearance="link"
                                                    onClick={() => handleEdit(rowData)}
                                                >
                                                    编辑
                                                </Button>
                                            </>
                                        )}
                                        {type !== 'unTranslate' && !rowDataFormValue && (
                                            <Button
                                                size="sm"
                                                onClick={() => handleDelete(id)}
                                                appearance="link"
                                            >
                                                删除
                                            </Button>
                                        )}
                                    </div>
                                );
                            }}
                        </Cell>
                    </Colum>
                </Table>
            </Form>
        </Panel>
    );
}

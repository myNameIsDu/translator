import SearchIcon from "@rsuite/icons/Search";
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
} from "rsuite";
import { json, type LoaderFunction } from "@remix-run/node";
import { useFetcher, useLoaderData, useSearchParams } from "@remix-run/react";
import { useMemo, useState, useRef } from "react";
import debounce from "lodash/debounce";
import { matchSorter } from "match-sorter";
import {
  readArrayComplete,
  getAllTextAndKey,
  readObjectComplete,
  getUnTranslate,
} from "../helper";

const Colum = Table.Column;
const HeaderCell = Table.HeaderCell;
const Cell = Table.Cell;

const filterData = [
  {
    value: "complete",
    label: "已翻译",
  },
  {
    value: "dead",
    label: "过期翻译",
  },
  {
    value: "unTranslate",
    label: "未翻译",
  },
] as const;
export type FilterType = typeof filterData[number]["value"];

type DataType = {
  key: string;
  "zh-CN": string;
  "en-US"?: string;
};

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url);
  const queryType = (url.searchParams.get("type") || "complete") as FilterType;
  const queryWord = url.searchParams.get("word") || "";

  let data: DataType[] = [];
  if (queryType === "complete") {
    data = readArrayComplete();
  } else if (queryType === "unTranslate") {
    data = getUnTranslate();
  } else if (queryType === "dead") {
    const { allKeys } = getAllTextAndKey();
    const originalCompleteData = readObjectComplete();
    let deadKeys: string[] = Object.keys(originalCompleteData).filter(
      (k) => !allKeys.includes(k)
    );
    data = deadKeys.map((key) => ({
      key,
      ...originalCompleteData[key],
    }));
  }
  if (queryWord) {
    return json(
      matchSorter(data, queryWord, { keys: ["zh-CN", "key", "en-US"] })
    );
  }
  return json(data);
};

export default function Index() {
  const deleteMutation = useFetcher();
  const importMutation = useFetcher();
  const editMutation = useFetcher();
  const loaderData = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const type = (searchParams.get("type") || "complete") as FilterType;
  const [searchWord, setSearchWord] = useState(searchParams.get("word") || "");
  const [editKey, setEditKey] = useState<string | null>(null);
  const formRef = useRef<FormInstance>();
  const [formValue, setFormValue] = useState({});

  const handleTypeChange = (v: string) => {
    handleCancel();
    searchParams.set("type", v);
    setSearchParams(searchParams);
  };
  const refetchWithSearchWord = useMemo(
    () =>
      debounce((v) => {
        if (v) {
          searchParams.set("word", v);
        } else {
          searchParams.delete("word");
        }
        setSearchParams(searchParams);
      }, 50),
    [searchParams, setSearchParams]
  );
  const handleInputChange = (v: string) => {
    setSearchWord(v);
    refetchWithSearchWord(v);
  };

  const downloadUnTranslate = () => {
    const a = document.createElement("a");
    a.href = "/export";
    a.click();
  };

  const handleDelete = (key: string) => {
    deleteMutation.submit({ key }, { method: "delete", action: "/delete" });
  };

  const handleImport = () => {
    const inputFile = document.createElement("input");
    inputFile.setAttribute("type", "file");
    inputFile.setAttribute("accept", ".xlsx");
    inputFile.click();
    inputFile.onchange = (event) => {
      const file = inputFile.files?.[0];
      file &&
        importMutation.submit(
          { file },
          { action: "/import", method: "put", encType: "multipart/form-data" }
        );
    };
  };

  const handleEdit = (rowData: DataType) => {
    const { key } = rowData;
    setEditKey(key);
    setFormValue(rowData);
  };

  const handleCancel = () => {
    setEditKey(null);
    formRef.current?.cleanErrors();
    setFormValue({});
  };

  const handleSubmit = (checkStatus: boolean) => {
    if (checkStatus) {
      editMutation.submit(formValue, { action: "/edit", method: "put" });
      handleCancel();
    }
  };

  return (
    <Panel>
      <Form
        onSubmit={handleSubmit}
        formValue={formValue}
        onChange={(value) => setFormValue(value)}
        ref={formRef}
      >
        <div className="flex mb-[30px]">
          <SelectPicker
            value={searchParams.get("type") || "complete"}
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
          <Button
            onClick={downloadUnTranslate}
            appearance="primary"
            className="mr-[20px]"
          >
            导出未翻译文案
          </Button>
          <Button onClick={handleImport} appearance="primary">
            导入翻译
          </Button>
        </div>
        <Table height={800} virtualized data={loaderData}>
          <Colum align="left" flexGrow={1} width={450}>
            <HeaderCell>key(当前词条的唯一标识，默认为中文key)</HeaderCell>
            <Cell>
              {(rowData) =>
                rowData.key === editKey ? (
                  <Form.Control
                    name="key"
                    disabled
                    className="relative left-0 top-[-8px]"
                    defaultValue={rowData["key"]}
                  />
                ) : (
                  rowData["key"]
                )
              }
            </Cell>
          </Colum>
          <Colum align="left" flexGrow={1} width={450}>
            <HeaderCell>中文</HeaderCell>
            <Cell>
              {(rowData) =>
                rowData.key === editKey ? (
                  <Form.Control
                    name="zh-CN"
                    disabled
                    className="relative left-0 top-[-8px]"
                    defaultValue={rowData["zh-CN"]}
                  />
                ) : (
                  rowData["zh-CN"]
                )
              }
            </Cell>
          </Colum>
          <Colum align="left" flexGrow={1} width={450}>
            <HeaderCell>英文</HeaderCell>
            <Cell>
              {(rowData) =>
                rowData.key === editKey ? (
                  <Form.Control
                    rule={Schema.Types.StringType().isRequired("请输入")}
                    name="en-US"
                    className="relative left-0 top-[-8px]"
                    errorPlacement="rightStart"
                    defaultValue={rowData["en-US"]}
                  />
                ) : (
                  rowData["en-US"]
                )
              }
            </Cell>
          </Colum>
          <Colum align="center" width={200}>
            <HeaderCell>操作</HeaderCell>
            <Cell style={{ padding: 6 }}>
              {(rowData) => {
                const { key } = rowData;
                return (
                  <div>
                    {editKey === key ? (
                      <>
                        <Button appearance="link" type="submit">
                          save
                        </Button>
                        <Button appearance="link" onClick={handleCancel}>
                          cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        disabled={editKey !== null}
                        appearance="link"
                        onClick={() => handleEdit(rowData)}
                      >
                        edit
                      </Button>
                    )}
                    {type !== "unTranslate" && !editKey && (
                      <Button
                        onClick={() => handleDelete(key)}
                        appearance="link"
                      >
                        delete
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

import DataSourceModule from "@/pages/DataAnalysis/OfflineManager/components/IntegratedConfiguration/IntegratedConfigs/DataSourceModule";
import { Form, FormInstance } from "antd";
import FieldMappingModule from "@/pages/DataAnalysis/OfflineManager/components/IntegratedConfiguration/IntegratedConfigs/FieldMappingModule";
import { useModel } from "@@/plugin-model/useModel";
import { CustomCollapseEnums } from "@/pages/DataAnalysis/OfflineManager/config";
import CustomCollapse from "@/pages/DataAnalysis/OfflineManager/components/IntegratedConfiguration/CustomCollapse";
import { useMemo } from "react";

export interface IntegratedConfigsProps {
  file: any;
  iid: number;
  form: FormInstance<any>;
  onSubmit: (field: any) => void;
  onFormChange: (changedValues?: any, allValues?: any) => void;
}

const IntegratedConfigs = ({
  file,
  iid,
  form,
  onSubmit,
  onFormChange,
}: IntegratedConfigsProps) => {
  const { source, target, mapping, setMapping } = useModel(
    "dataAnalysis",
    (model) => ({
      source: model.integratedConfigs.sourceColumns,
      target: model.integratedConfigs.targetColumns,
      mapping: model.integratedConfigs.mappingData,
      setMapping: model.integratedConfigs.setMappingData,
    })
  );
  const { currentUser } = useModel("@@initialState").initialState || {};
  const isLock = useMemo(
    () =>
      !file.lockUid || file?.lockUid === 0 || file?.lockUid !== currentUser?.id,
    [currentUser?.id, file.lockUid]
  );

  //
  // {
  //   "mappingData": [
  //   {
  //     "sourceNode": "source",
  //     "targetNode": "target",
  //     "source": "event_type",
  //     "target": "id"
  //   }
  // ],
  //   "sourceData": [
  //   {
  //     "id": "source",
  //     "title": "Source",
  //     "fields": [
  //       {
  //         "id": "event_type",
  //         "disable": false,
  //         "field": "event_type",
  //         "type": "LowCardinality(String)"
  //       }
  //     ]
  //   }
  // ],
  //   "targetData": [
  //   {
  //     "id": "target",
  //     "title": "Target",
  //     "fields": [
  //       {
  //         "id": "id",
  //         "disable": false,
  //         "field": "id",
  //         "type": "int(11)"
  //       },
  //     ]
  //   }
  // ]
  // }
  const handelChangeMapping = (data: any) => {
    console.log("data: ", data);
    onFormChange();
    const { mappingData, sourceData, targetData } = data;
    const result: any[] = [];
    mappingData.forEach((item: any) => {
      const sourceType = sourceData
        .find((source: any) => source.id === item.sourceNode)
        ?.fields.find((field: any) => field.id === item.source)?.type;
      const targetType = targetData
        .find((target: any) => target.id === item.targetNode)
        ?.fields.find((field: any) => field.id === item.target)?.type;
      result.push({
        ...item,
        sourceType,
        targetType,
      });
    });
    setMapping(result);
  };

  const FieldMapping = useMemo(() => {
    return (
      <FieldMappingModule
        form={form}
        iid={iid}
        source={source}
        target={target}
        mapping={
          mapping.length > 0
            ? mapping.map((item) => ({
                ...item,
                sourceNode: "source",
                targetNode: "target",
              }))
            : []
        }
        isLock={isLock}
        onChange={handelChangeMapping}
      />
    );
  }, [source, target, mapping, form, iid, isLock]);

  return (
    <div
      style={{
        height: "100%",
        overflowY: "scroll",
        paddingBottom: "30px",
      }}
    >
      <Form
        labelCol={{
          span: 5,
        }}
        wrapperCol={{ span: 19 }}
        size={"small"}
        form={form}
        onFinish={onSubmit}
        onValuesChange={onFormChange}
      >
        <CustomCollapse
          children={<DataSourceModule file={file} form={form} iid={iid} />}
          type={CustomCollapseEnums.dataSource}
        />
        <CustomCollapse
          children={FieldMapping}
          type={CustomCollapseEnums.fieldMapping}
        />
      </Form>
    </div>
  );
};
export default IntegratedConfigs;

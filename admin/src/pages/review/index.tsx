import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Form,
  InputNumber,
  Select,
  Button,
  Image,
  Rate,
  Tag,
  Tooltip,
  Popconfirm,
  message,
  Space,
} from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getReviewListApi, deleteReviewApi } from '../../api/review';

interface Review {
  id: number;
  userPhone: string;
  productName: string;
  rating: number;
  content: string;
  images?: string[];
  anonymous: boolean;
  createdAt: string;
}

const maskPhone = (phone: string) => {
  if (!phone || phone.length < 7) return phone;
  return phone.slice(0, 3) + '****' + phone.slice(-4);
};

const ReviewPage: React.FC = () => {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchList = async (p = page, ps = pageSize) => {
    setLoading(true);
    try {
      const values = searchForm.getFieldsValue();
      const res: any = await getReviewListApi({ ...values, page: p, pageSize: ps });
      const d = res.data ?? res;
      setList(d.list ?? d.items ?? d.rows ?? []);
      setTotal(d.total ?? 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleSearch = () => {
    setPage(1);
    fetchList(1, pageSize);
  };

  const handleReset = () => {
    searchForm.resetFields();
    setPage(1);
    fetchList(1, pageSize);
  };

  const handleDelete = async (id: number) => {
    await deleteReviewApi(id);
    message.success('删除成功');
    fetchList();
  };

  const columns: ColumnsType<Review> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    {
      title: '用户',
      dataIndex: 'userPhone',
      key: 'userPhone',
      width: 130,
      render: (v: string) => maskPhone(v),
    },
    { title: '商品名', dataIndex: 'productName', key: 'productName', width: 160 },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 160,
      render: (v: number) => <Rate disabled value={v} style={{ fontSize: 14 }} />,
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: 200,
      ellipsis: true,
      render: (v: string) => (
        <Tooltip title={v}>
          <span>{v}</span>
        </Tooltip>
      ),
    },
    {
      title: '图片',
      dataIndex: 'images',
      key: 'images',
      width: 160,
      render: (imgs: string[]) =>
        imgs && imgs.length > 0 ? (
          <Image.PreviewGroup>
            <Space>
              {imgs.slice(0, 3).map((url, i) => (
                <Image key={i} src={url} width={36} height={36} style={{ objectFit: 'cover', borderRadius: 4 }} />
              ))}
              {imgs.length > 3 && <span>+{imgs.length - 3}</span>}
            </Space>
          </Image.PreviewGroup>
        ) : (
          '-'
        ),
    },
    {
      title: '匿名',
      dataIndex: 'anonymous',
      key: 'anonymous',
      width: 70,
      render: (v: boolean) => (v ? <Tag color="orange">是</Tag> : <Tag>否</Tag>),
    },
    { title: '时间', dataIndex: 'createdAt', key: 'createdAt', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: unknown, record: Review) => (
        <Popconfirm title="确定删除此评价？" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" size="small" danger>
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Card className="page-search-card" style={{ marginBottom: 16 }}>
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Form.Item name="productId" label="商品ID">
            <InputNumber placeholder="请输入商品ID" style={{ width: 140 }} />
          </Form.Item>
          <Form.Item name="rating" label="评分">
            <Select placeholder="请选择" allowClear style={{ width: 120 }}>
              {[1, 2, 3, 4, 5].map((v) => (
                <Select.Option key={v} value={v}>
                  {v}星
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button onClick={handleReset} icon={<ReloadOutlined />}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card className="page-table-card" title="评价管理">
        <Table<Review>
          rowKey="id"
          size="middle"
          loading={loading}
          columns={columns}
          dataSource={list}
          pagination={{
            current: page,
            pageSize,
            total,
            showTotal: (t) => `共 ${t} 条`,
            showSizeChanger: true,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
              fetchList(p, ps);
            },
            style: { justifyContent: 'flex-end' },
          }}
        />
      </Card>
    </>
  );
};

export default ReviewPage;

import { Order, Product } from "@prisma/client";
import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
  Button,
  Column,
  Img,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { formatPrice } from "@/lib/formatters";
const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

interface EmailTemplateProps {
  orderProducts: Product[];
  currentOrder: Order;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  orderProducts,
  currentOrder,
}) => (
  <Html>
    <Preview>View your lynxlink receipt</Preview>
    <Tailwind>
      <Head />
      <Body className="font-sans bg-white">
        <Container className="max-w-xl">
          <Heading>Purchase Receipt</Heading>
          <Section>
            <Row>
              <Column>
                <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                  Order ID
                </Text>
                <Text className="mt-0 mr-4">{currentOrder.id}</Text>
              </Column>
              <Column>
                <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                  Purchased On
                </Text>
                <Text className="mt-0 mr-4">
                  {dateFormatter.format(currentOrder.createdAt)}
                </Text>
              </Column>
              <Column>
                <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                  Price Paid
                </Text>
                <Text className="mt-0 mr-4">
                  {formatPrice(currentOrder.pricePaidInCents / 100)}
                </Text>
              </Column>
            </Row>
          </Section>
          <Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4">
            {orderProducts.map((prod: any) => (
              <>
                <Img
                  key={prod.id}
                  width="100%"
                  alt={prod.name}
                  src={prod.images[0]?.url}
                />
                <Row className="mt-8">
                  <Column className="align-bottom">
                    <Text className="text-lg font-bold m-0 mr-4">
                      {prod.name}
                    </Text>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Text className="text-gray-500 mb-0">
                      {prod.description}
                    </Text>
                  </Column>
                </Row>
              </>
            ))}
            <Section>
              <Button
                href={`${process.env.NEXT_PUBLIC_SERVER_URL}/products`}
                className="bg-black text-white px-6 py-4 rounded text-lg"
              >
                Continue shopping
              </Button>
            </Section>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

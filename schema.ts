// Welcome to your schema
//   Schema driven development is Keystone's modus operandi
//
// This file is where we define the lists, fields and hooks for our data.
// If you want to learn more about how lists are configured, please read
// - https://keystonejs.com/docs/config/lists

import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example
import {
  text,
  password,
  timestamp,
  integer,
  checkbox,
  image,
  select,
  relationship,
  json,
} from "@keystone-6/core/fields";
import { generatePlaceholder } from "./utils";
import { KeystoneContext } from "@keystone-6/core/types";

// the document field is a more complicated field, so it has it's own package
// if you want to make your own fields, see https://keystonejs.com/docs/guides/custom-fields

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
// import type { Lists } from ".keystone/types";

export const lists = {
  User: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: text({ validation: { isRequired: true } }),

      email: text({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: "unique",
      }),

      password: password({ validation: { isRequired: true } }),

      createdAt: timestamp({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: "now" },
      }),
    },
  }),

  Producto: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // this is the fields for our Producto list
    fields: {
      nombre: text({ validation: { isRequired: true } }),

      // the document field can be used for making rich editable content
      //   you can find out more at https://keystonejs.com/docs/guides/document-fields
      descripcion: text({ validation: { isRequired: true } }),
      precio: integer({
        validation: { isRequired: true },
      }),
      es_visible: checkbox({ defaultValue: true }),
      imagen: image({ storage: "delicious_vicious_bucket" }),
      imagenPlaceholder: text({}),
      categoria: relationship({
        ref: "Categoria.productos",
        ui: {
          displayMode: "select",
          labelField: "nombre",
        },
      }),
    },
    hooks: {
      afterOperation: async ({
        operation,
        item,
        context,
        resolvedData,
      }: {
        operation: string;
        item: any;
        context: KeystoneContext;
        resolvedData: any;
      }) => {
        if (
          (operation === "create" || operation === "update") &&
          resolvedData?.imagen.id
        ) {
          if (item.imagen_id) {
            const imageContext = context.images("delicious_vicious_bucket");
            const imageUrl = await imageContext.getUrl(
              item.imagen_id,
              item.imagen_extension
            );

            const placeholder = await generatePlaceholder(imageUrl);
            await context.query.Producto.updateOne({
              where: { id: item.id },
              data: { imagenPlaceholder: placeholder },
            });
          }
        }
      },
    },
  }),

  Categoria: list({
    access: allowAll,
    fields: {
      nombre: text({ validation: { isRequired: true } }),
      productos: relationship({
        ref: "Producto.categoria",
        many: true,
        ui: {
          labelField: "nombre",
        },
      }),
    },
  }),

  Portada: list({
    access: allowAll,
    fields: {
      nombre: text({ validation: { isRequired: true } }),
      es_visible: checkbox({ defaultValue: true }),
      imagen: image({ storage: "delicious_vicious_bucket" }),
    },
  }),

  Box: list({
    access: allowAll,
    fields: {
      nombre: text({ validation: { isRequired: true } }),
      size: integer({ validation: { isRequired: true } }),
      es_visible: checkbox({ defaultValue: true }),
      imagen: image({ storage: "delicious_vicious_bucket" }),
      orders: relationship({
        ref: "Order.box", // Reference the 'box' field in the Order list
        many: true, // Box can have many orders
        ui: {
          displayMode: "count",
        },
      }),
    },
  }),
  Order: list({
    access: allowAll,
    fields: {
      nombre: text({
        validation: { isRequired: true },
      }),
      email: text({
        validation: { isRequired: true },
      }),
      telefono: text({
        validation: { isRequired: true },
      }),
      referencia: text(),
      direccion: text(),
      google_maps_link: text(),
      dia_entrega: text(),
      hora_entrega: text(),
      tipo_entrega: text({
        validation: { isRequired: true },
      }),
      productos: text({
        validation: { isRequired: true },
        ui: {
          displayMode: "textarea",
        },
      }),
      total_orden: integer({
        validation: { isRequired: true },
      }),
      status: select({
        defaultValue: "created",
        options: [
          {
            label: "Orden creada",
            value: "created",
          },
          {
            label: "Orden Pagada",
            value: "paid",
          },
          {
            label: "Orden Finalizada",
            value: "finished",
          },
        ],
      }),
      box: relationship({
        ref: "Box.orders", // Reference the 'orders' field in the Box list
        label: "Tamaño de la caja",
        ui: {
          displayMode: "select",
          labelField: "size",
        },
      }),
    },
  }),
  Stock: list({
    access: allowAll,
    fields: {
      actualizado_en: timestamp({
        defaultValue: { kind: "now" },
        validation: { isRequired: true },
      }),
      valido_desde: timestamp({
        isIndexed: "unique",
        validation: { isRequired: true },
      }),
      valido_hasta: timestamp({
        isIndexed: "unique",
        validation: { isRequired: true },
      }),
      es_valido: checkbox({ defaultValue: true }),
      productos: json(),
    },
  }),
};

function openPopup() {
    if (!w2ui.foo) {
        $().w2form({
            name: 'foo',
            url: {
                save: '/OrderDetail/Update'
            },
            style: 'border: 0px; background-color: transparent;',
            fields: [
                {
                    field: 'orderId', type: 'list', required: true,
                    html: {
                        label: 'Orden',
                        span: 7,
                        attr: 'placeholder="Seleccione una orden..."; style="width:calc(100% - 10px)"'
                    },
                    options: {
                        url: '/OrderDetail/DropdownOrder',
                        minLength: 0,
                        msgNoItems: 'No se encontraron coincidencias.'
                    }
                },
                {
                    field: 'productId', type: 'list', required: true,
                    html: {
                        label: 'Producto',
                        span: 7,
                        attr: 'placeholder="Seleccione un producto..."; style="width:calc(100% - 10px)"'
                    },
                    options: {
                        url: '/OrderDetail/DropdownProduct',
                        minLength: 0,
                        msgNoItems: 'No se encontraron coincidencias.'
                    }
                },
                {
                    field: 'quantity', type: 'int', required: true,
                    html: {
                        label: 'Cantidad del Producto',
                        span: 7,
                        attr: 'style="width: calc(100% - 10px)"'
                    }
                },
                {
                    field: 'unitPrice', type: 'money', required: true,
                    html: {
                        label: 'Precio por Unidad',
                        span: 7,
                        attr: 'style="width: calc(100% - 10px)"'
                    }
                }
            ],
            actions: {
                "Limpiar": function () { this.clear(); },
                "Guardar": function () {
                    this.save();
                    if (w2ui.foo.validate().length == 0) {
                        w2popup.close();
                        w2ui['grid'].reload();
                    }
                }
            },
            onRender: function (event) {
                var grid = w2ui.grid;
                var form = w2ui.foo;

                event.onComplete = function () {
                    var sel = grid.getSelection();
                    if (sel.length == 1) {
                        form.recid = sel[0];
                        form.record = $.extend(true, {}, grid.get(sel[0]));
                        form.refresh();
                    } else {
                        form.clear();
                    }
                }
            },
            onSubmit: function (formObj) {
                var record;

                record = { id: formObj.postData.record.id, orderId: formObj.postData.record.orderId.id, productId: formObj.postData.record.productId.id, quantity: formObj.postData.record.quantity, unitPrice: formObj.postData.record.unitPrice };
                $.extend(formObj.postData, record);
            }
        });
    }

    w2popup.open({
        title: 'Editar registro',
        width: 500,
        height: 290,
        body: '<div id="form" style="width: 100%; height: 100%;"></div>',
        style: 'padding: 15px 0px 0px 0px',
        showMax: true,
        onToggle: function (event) {
            $(w2ui.foo.box).hide();
            event.onComplete = function () {
                $(w2ui.foo.box).show();
                w2ui.foo.resize();
            }
        },
        onOpen: function (event) {
            event.onComplete = function () {
                // specifying an onOpen handler instead is equivalent to specifying an onBeforeOpen handler, which would make this code execute too early and hence not deliver.
                $('#w2ui-popup #form').w2render('foo');
            }
        },
        onClose: function (event) {
            event.onComplete = function () {
                w2ui['foo'].clear();
            }
        }
    })
}

function detail() {
    w2popup.open({
        title: 'Detalles del registro',
        width: 600,
        height: 300,
        showMax: true,
        body: '<div id="main" style="position: absolute; left: 5px; top: 5px; right: 5px; bottom: 5px;"></div>',
        onOpen: function (event) {
            event.onComplete = function () {
                $('#w2ui-popup #main').w2render('detail');
            };
        },
        onToggle: function (event) {
            event.onComplete = function () {
                w2ui.grid.resize();
            }
        }
    });
}
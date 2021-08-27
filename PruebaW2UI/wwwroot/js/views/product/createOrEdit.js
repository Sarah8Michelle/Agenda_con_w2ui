function openPopup(id = 0, editMode = false) {
    if (!w2ui.foo) {
        $().w2form({
            name: 'foo',
            url: {
                save: '/Product/CreateOrEdit'
            },
            style: 'border: 0px; background-color: transparent;',
            fields: [
                { field: 'name', type: 'text', required: true, html: { label: 'Nombre del Producto' } },
                {
                    field: 'category', type: 'list', html: { label: 'Categoría' }, options: {
                        items: ['Ropa', 'Accesorios', 'Calzados', 'Electrónicos', 'Electrodomésticos', 'Comida', 'Libros', 'Juguetes', 'Belleza']
                    }
                },
                {
                    field: 'unitPrice', type: 'float', html: { label: 'Precio por Unidad', attr: 'style="width: 60px"' },
                    options: {
                        arrows: true,
                        format: true,
                        precision: 2,
                        min: 0,
                        max: 200,
                        step: 0.1
                    }
                },
                {
                    field: 'unitsInStock', type: 'int', html: { label: 'Unidades en Almacén', attr: 'style="width: 60px"' },
                    options: {
                        arrows: true,
                        min: 0,
                        max: 50
                    }
                },
                {
                    field: 'unitsInOrder', type: 'int', html: { label: 'Unidades en Pedidos', attr: 'style="width: 60px"' },
                    options: {
                        arrows: true,
                        min: 0,
                        max: 50
                    }
                },
                { field: 'discontinued', type: 'checkbox', html: { label: '¿Descontinuado?' } },
            ],
            actions: {
                "Limpiar": function () { this.clear(); },
                "Guardar": function () {
                    this.save();
                    if (w2ui.foo.validate().length == 0) {
                        w2popup.close();
                    }
                }
            },
            onSubmit: function (formName, formObj) {
                var record;

                if (editMode) {
                    console.log(formObj.postData.record);
                    //record = { id: formObj.postData.record.id, name: formObj.postData.record.name, category: formObj.postData.record.category.text, unitPrice: formObj.postData.record.unitPrice, unitsInStock: formObj.postData.record.unitsInStock, unitsInOrder: formObj.postData.record.unitsInOrder, discontinued: formObj.postData.record.discontinued };
                }

                else {
                    console.log(formObj.postData.record);
                    //record = { name: formObj.postData.record.name, category: formObj.postData.record.category.text, unitPrice: formObj.postData.record.unitPrice, unitsInStock: formObj.postData.record.unitsInStock, unitsInOrder: formObj.postData.record.unitsInOrder, discontinued: formObj.postData.record.discontinued }
                }

                //$.extend(formObj.postData, record);
            },
            onRender: function (event) {
                var grid = w2ui.grid;
                var form = w2ui.foo;

                event.onComplete = function () {
                    if (editMode) {
                        var sel = grid.getSelection();

                        if (sel.length == 1) {
                            form.recid = sel[0];
                            form.record = $.extend(true, {}, grid.get(sel[0]));
                            form.refresh();
                        } else {
                            form.clear();
                        }
                    }
                }
            }
        });
    }

    w2popup.open({
        title: (editMode == false ? 'Crear registro' : 'Editar registro'),
        with: 450,
        height: 320,
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
                w2ui['grid'].reload();
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
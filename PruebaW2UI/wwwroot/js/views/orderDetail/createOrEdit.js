//function openPopup(id = 0, editMode = false) {
//    if (!w2ui.foo) {
//        $().w2form({
//            name: 'foo',
//            url: {
//                save: '/OrderDetail/CreateOrEdit'
//            },
//            style: 'border: 0px; background-color: transparent;',
//            fields: [
//                {
//                    field: 'unitPrice', type: 'float', html: { label: 'Precio por Unidad', attr: 'style="width: 60px"' },
//                    options: {
//                        arrows: true,
//                        format: true,
//                        precision: 2,
//                        min: 0,
//                        max: 200,
//                        step: 0.1
//                    }
//                },
//                { field: 'quantity', type: 'text', required: true, html: { label: 'Cantidad', attr: 'size="30"' } },
//                {
//                    field: 'productId',
//                    type: 'list',
//                    html: { label: 'Producto', attr: 'size="30"' }
//                },
//                {
//                    field: 'orderId',
//                    type: 'list',
//                    html: { label: 'Orden', attr: 'size="30"' }
//                }
//            ],
//            actions: {
//                "Limpiar": function () { this.clear(); },
//                "Guardar": function () {
//                    this.save();
//                    if (w2ui.foo.validate().length == 0) {
//                        w2popup.close();
//                    }
//                }
//            },
//            onRender: function (event) {
//                var grid = w2ui.grid;
//                var form = w2ui.foo;

//                event.onComplete = function () {
//                    if (editMode) {
//                        var sel = grid.getSelection();

//                        if (sel.length == 1) {
//                            form.recid = sel[0];
//                            form.record = $.extend(true, {}, grid.get(sel[0]));
//                            form.refresh();
//                        } else {
//                            form.clear();
//                        }
//                    }
//                }
//            },
//            onSubmit: function (formName, formObj) {
//                var record;

//                if (editMode) {
//                    console.log(formObj.postData.record);
//                    record = { id: formObj.postData.record.id, unitPrice: formObj.postData.record.unitPrice, quantity: formObj.postData.record.quantity, productId: formObj.postData.record.productId.id, orderId: formObj.postData.record.orderId.id };
//                }

//                else {
//                    console.log(formObj.postData.record);
//                    record = { unitPrice: formObj.postData.record.unitPrice, quantity: formObj.postData.record.quantity, productId: parseInt(formObj.postData.record.productId.id), orderId: parseInt(formObj.postData.record.orderId.id) }
//                }

//                //$.extend(formObj.postData, record);
//            }
//        });
//    }

//    w2popup.open({
//        title: (editMode == false ? 'Crear registro' : 'Editar registro'),
//        with: 500,
//        height: 260,
//        body: '<div id="form" style="width: 100%; height: 100%;"></div>',
//        style: 'padding: 15px 0px 0px 0px',
//        showMax: true,
//        onToggle: function (event) {
//            $(w2ui.foo.box).hide();
//            event.onComplete = function () {
//                $(w2ui.foo.box).show();
//                w2ui.foo.resize();
//            }
//        },
//        onOpen: function (event) {
//            event.onComplete = function () {
//                // specifying an onOpen handler instead is equivalent to specifying an onBeforeOpen handler, which would make this code execute too early and hence not deliver.
//                $('#w2ui-popup #form').w2render('foo');
//            }
//        },
//        onClose: function (event) {
//            event.onComplete = function () {
//                w2ui['foo'].clear();
//                w2ui['grid'].reload();
//            }
//        }
//    })
//}

//function testPopup(editMode = false, id = 0) {
//    if (!w2ui.form) {
//        $().w2form({
//            name: 'form',
//            url: {
//                save: '/OrderDetail/CreateOrEdit'
//            },
//            style: 'border: 0px; background-color: transparent;',
//            fields: [
//                { field: 'unitPrice', type: 'text', required: true, html: { label: 'Precio por Unidad', attr: 'size="30"' } },
//                { field: 'quantity', type: 'text', required: true, html: { label: 'Cantidad', attr: 'size="30"' } },
//                {
//                    field: 'productId',
//                    type: 'list',
//                    html: { label: 'Producto', attr: 'size="30"' }
//                },
//                {
//                    field: 'orderId',
//                    type: 'list',
//                    html: { label: 'Orden', attr: 'size="30"' }
//                }
//            ],
//            actions: {
//                "Limpiar": function () { this.clear(); },
//                "Guardar": function () {                    
//                    var errors = this.validate();
//                    if (errors.length > 0) return;
//                    if (this.recid == 0) {
//                        w2ui.detailGrid.add($.extend(true, { recid: w2ui.detailGrid.records.length + 1 }, this.record));
//                        w2ui.detailGrid.selectNone();
//                        this.clear();
//                    } else {
//                        w2ui.detailGrid.set(this.recid, this.record);
//                        w2ui.detailGrid.selectNone();
//                        this.clear();
//                    }
//                }
//            },
//            onRender: function (event) {
//                var grid = w2ui.grid;
//                var form = w2ui.form;

//                event.onComplete = function () {
//                    if (editMode) {
//                        var sel = grid.getSelection();

//                        if (sel.length == 1) {
//                            form.recid = sel[0];
//                            form.record = $.extend(true, {}, grid.get(sel[0]));
//                            form.refresh();
//                        } else {
//                            form.clear();
//                        }
//                    }
//                }
//            },
//            onSubmit: function (formName, formObj) {
//                var record;

//                if (editMode) {
//                    console.log(formObj.postData.record);
//                    record = { id: formObj.postData.record.id, unitPrice: formObj.postData.record.unitPrice, quantity: formObj.postData.record.quantity, productId: formObj.postData.record.productId.id, orderId: formObj.postData.record.orderId.id };
//                }

//                else {
//                    console.log(formObj.postData.record);
//                    record = { unitPrice: formObj.postData.record.unitPrice, quantity: formObj.postData.record.quantity, productId: parseInt(formObj.postData.record.productId.id), orderId: parseInt(formObj.postData.record.orderId.id) }
//                }

//                //$.extend(formObj.postData, record);
//            }
//        });

//        $().w2layout({
//            name: 'layout',
//            padding: 4,
//            panels: [
//                { type: 'bottom', size: '50%', resizable: true, minSize: 300 },
//                { type: 'main', minSize: 300 }
//            ]
//        });

//        $().w2grid({
//            name: 'detailGrid',
//            columns: [
//                { field: 'unitPrice', text: 'Precio de Unidad', size: '33%', sortable: true, searchable: true, render: 'money' },
//                { field: 'quantity', text: 'Cantidad', size: '33%', sortable: true, searchable: true },
//                //{ field: 'productId', text: 'Producto', size: '33%' },
//                //{ field: 'orderId', text: 'Orden', size: '120px' }
//            ],
//            records: [
//                { recid: 2, unitPrice: 5.00, quantity: 3/*, productId: 1, orderId: 2*/ },
//                { recid: 3, unitPrice: 10.00, quantity: 4/*, productId: 4, orderId: 2*/ }
//            ]
//            //onClick: function (event) {
//            //    var grid = this;
//            //    var form = w2ui.form;
//            //    event.onComplete = function () {
//            //        var sel = grid.getSelection();
//            //        if (sel.length == 1) {
//            //            form.recid = sel[0];
//            //            form.record = $.extend(true, {}, grid.get(sel[0]));
//            //            form.refresh();
//            //        } else {
//            //            form.clear();
//            //        }
//            //    }
//            //}
//        });
//    }

//    w2popup.open({
//        title: 'Detalles de Orden',
//        width: 900,
//        height: 600,
//        showMax: true,
//        body: '<div id="main" style="position: absolute; left: 5px; top: 5px; right: 5px; bottom: 5px;"></div>',
//        onOpen: function (event) {
//            event.onComplete = function () {
//                $('#w2ui-popup #main').w2render('layout');
//                w2ui.layout.html('left', w2ui.detailGrid);
//                w2ui.layout.html('main', w2ui.form);
//            };
//        },
//        onToggle: function (event) {
//            event.onComplete = function () {
//                w2ui.layout.resize();
//            }
//        },
//        onClose: function (event) {
//            event.onComplete = function () {
//                w2ui['form'].clear();
//                w2ui['detailGrid'].reload();
//            }
//        }
//    });
//}

//function detail() {
//    w2popup.open({
//        title: 'Detalles del registro',
//        width: 600,
//        height: 300,
//        showMax: true,
//        body: '<div id="main" style="position: absolute; left: 5px; top: 5px; right: 5px; bottom: 5px;"></div>',
//        onOpen: function (event) {
//            event.onComplete = function () {
//                $('#w2ui-popup #main').w2render('detail');
//            };
//        },
//        onToggle: function (event) {
//            event.onComplete = function () {
//                w2ui.grid.resize();
//            }
//        }
//    });
//}

//function DropdownProduct() {
//    $('#productId')
//        .attr('placeholder', 'Seleccione un producto...')
//        .w2field('list', { url: '/OrderDetail/DropdownProduct', minLength: 0 });
//}

//function DropdownOrder() {
//    $('#orderId')
//        .attr('placeholder', 'Seleccione una orden...')
//        .w2field('list', { url: '/OrderDetail/DropdownOrder', minLength: 0 });
//}
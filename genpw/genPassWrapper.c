#include "Python.h"
#include <string.h>

extern char* myGenPw(char*,char*,char*);
//extern char* test();

PyObject* genPassword(PyObject* self, PyObject* args){
    //PyObject* PyTuple_GetItem(PyObject *p, Py_ssize_t pos);
    PyObject *tup_item;
    PyObject *temp;
    Py_ssize_t pos;
    char *max_s;   //max pw length
    char *flags;   //ulsn
    char *symbols; //symbols which contained pw

    int r = PyArg_ParseTuple(args, "sss", &max_s, &flags, &symbols);
    if (r == 0) {
        PyErr_Print();
        return Py_BuildValue("s", PyUnicode_DecodeFSDefault("args failed"));
    }

    char *passwd = myGenPw(max_s, flags, symbols);
    // avoid !utf8
    char *passwd_copy = (char*)malloc( sizeof(char) * (strlen(passwd)+1) );
    //char *passwd = test();
    strncpy(passwd_copy,passwd,strlen(passwd)+1);
    return Py_BuildValue("s", passwd_copy);
}

static PyMethodDef module_methods[] = {
	{"genPassword", genPassword, METH_VARARGS},
	{NULL},
};

static struct PyModuleDef genPassModule =
{
    PyModuleDef_HEAD_INIT,
    "genPassModule", /* name of module */
    "",          /* module documentation, may be NULL */
    -1,          /* size of per-interpreter state of the module, or -1 if the module keeps state in global variables. */
    module_methods
};

PyMODINIT_FUNC PyInit_genPassModule(void)
{
    return PyModule_Create(&genPassModule);
}
